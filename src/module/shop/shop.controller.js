const shopService = require("./shop.service");
const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
  
} = require("../../utils/responseHandler");
const { operableEntities } = require("../../config/constants");
const {
  uploadShopImage,
  storageMap,
  removeFile,
} = require("../../utils/fileHandle");
const { isPostBodyValid, isPatchBodyValid } = require("./shop.validate");
const { fieldsMap, uploadHandler } = require("../../utils/uploader");
//
const User = require("../user/user.model");
const Profile = require("../profile/seller-profile/profile.model");
const Shop = require("./shop.model");
//

async function updateStatusBySeller(req, res, next) {
  try {
    console.log("role from updateStatusBySeller : " + req.role);
    const updatableId = req.params.id;
    const { is_active } = req.body;
    const existingShop = await Shop.findById(updatableId);
    //
    console.log("--------------------------- " + JSON.stringify(existingShop));
    //
    if (existingShop) {
      if (is_active === true || is_active === false) {
        const editResult = await Shop.findByIdAndUpdate(
          updatableId,
          {
            is_active,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.shop,
          data: editResult,
        });
      } else {
        res
          .status(400)
          .send({ message: "Invalid request for change of status" });
      }
    } else {
      res.status(400).send({ message: "Id not found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error updating status" });
  }
}

async function updateApprovalByAdmin(req, res, next) {
  try {
    console.log("role from updateStatusBySeller : " + req.role);
    const updatableId = req.params.id;
    const { status } = req.body;
    const existingShop = await Shop.findById(updatableId);

    if (existingShop) {
      if (
        [
          "APPROVED",
          "DISAPPROVAL",
          "PENDING",
          "CANCELLED",
          "UNDER_REVIEW",
        ].includes(status)
      ) {
        const editResult = await Shop.findByIdAndUpdate(
          updatableId,
          {
            status,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.shop,
          data: editResult,
        });
      } else {
        res
          .status(400)
          .send({ message: "Invalid request for change of status" });
      }
    } else {
      res.status(400).send({ message: "Id not found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error updating status" });
  }
}

async function createShop(req, res, next) {
  let paths = {};
  let flows = {
    [operableEntities.user]: false,
    [operableEntities.seller_profile]: false,
    [operableEntities.shop]: false,
  };
  let what = "";
  let addProfileResult, addShopResult, addUserResult;
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });
    //
    if (valid.success) {
      let len = fieldsMap[operableEntities.shop].length;
      for (let i = 0; i < len; i++) {
        let fieldName = fieldsMap[operableEntities.shop][i].name;
        if (req?.files?.[fieldName]) {
          paths[fieldName] = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
        }
      }
      try {
        what = operableEntities.seller_profile;
        addProfileResult = await Profile.create({
          full_name: valid.seller_fullname,
          gender: valid.seller_gender,
          phone: valid.seller_phone,
          profile: paths?.["seller_profile"],
        });
        flows[operableEntities.seller_profile] = true;
        //
        what = operableEntities.user;
        addUserResult = await User.create({
          email: valid.account_email,
          password: valid.account_password,
          role: valid.account_role,
          profile_id: addProfileResult._id,
        });
        flows[operableEntities.user] = true;
        //
        what = operableEntities.shop;
        addShopResult = await Shop.create({
          seller: addProfileResult._id,
          shop_name: valid.shop_name,
          shop_address: valid.shop_address,
          shop_logo: paths?.["shop_logo"],
          shop_banner: paths?.["shop_banner"],
          description: valid.description,
        });
        flows[operableEntities.shop] = true;
        //
        sendCreateResponse({
          res,
          what: operableEntities.shop,
          data: {
            seller: addProfileResult,
            user: { email: addUserResult.email, role: addUserResult.role },
            shop: addShopResult,
          },
        });
      } catch (error) {
        console.log("err-0" + JSON.stringify(error));
        //  act flow wise
        if (flows[operableEntities.seller_profile]) {
          console.log("if-1");
          await Profile.findByIdAndDelete(addProfileResult.id);
        }
        if (flows[operableEntities.user]) {
          console.log("if-2");
          await User.findByIdAndDelete(addUserResult.id);
        }
        if (flows[operableEntities.shop]) {
          console.log("if-3");
          await Shop.findByIdAndDelete(addShopResult.id);
        }
        sendErrorResponse({ res, error , what });
      }
    } else {
      console.log("err-1");
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    onsole.log("err-2");
    sendErrorResponse({ res, error, what: operableEntities.shop });
  }
}

//
async function updateShop(req, res) {
  try {
    const idUpdatableId = req.params.id;
    let paths = {};
    //
    try {
      const updatableShop = await Shop.findById(idUpdatableId);
      if (updatableShop) {
        const valid = isPatchBodyValid({
          updatable: updatableShop,
          bodyData: req.body,
        });
        let len = fieldsMap[operableEntities.shop].length;
        for (let i = 0; i < len; i++) {
          let fieldName = fieldsMap[operableEntities.shop][i].name;
          if (req?.files?.[fieldName]) {
            paths[fieldName] = await uploadHandler({
              what: fieldName,
              file: req.files[fieldName][0],
            });
            removeFile({ fileUrl: updatableShop[fieldName] });
          }
        }

        const editResult = await Shop.findByIdAndUpdate(
          idUpdatableId,
          {
            ...valid,
            shop_logo: paths["shop_logo"]
              ? paths["shop_logo"]
              : updatableShop["shop_logo"],
            shop_banner: paths["shop_banner"]
              ? paths["shop_banner"]
              : updatableShop["shop_banner"],
          },
          { new: true }
        );

        sendUpdateResponse({
          res,
          what: operableEntities.shop,
          data: editResult,
        });
      } else {
        res.send({
          success: false,
          status: 404,
          message: "Id not found",
        });
      }
    } catch (error) {
      console.log("error cash ... ");
      sendErrorResponse({ res, error, what: operableEntities.shop });
    }
  } catch (error) {
    console.log("error cash ... 2");
    sendErrorResponse({ res, error, what: operableEntities.ad });
  }
}

async function getShops(req, res) {
  const result = await shopService.getShops(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.shop });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.shop });
  }
}
//

//
async function deleteShop(req, res) {
  const result = await shopService.deleteShop(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.shop });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.shop });
  }
}
//
module.exports = {
  createShop,
  updateShop,
  deleteShop,
  getShops,
  updateApprovalByAdmin,
  updateStatusBySeller,
};
