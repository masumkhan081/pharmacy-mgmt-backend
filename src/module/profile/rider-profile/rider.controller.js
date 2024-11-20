const riderService = require("./rider.service");
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
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { fieldsMap, uploadHandler } = require("../../../utils/uploader");
const { isPostBodyValid } = require("./rider.validate");
const Rider = require("./rider.model");
const { removeFile } = require("../../../utils/fileHandle");

async function getSingleRider(req, res) {
  try {
    const result = await riderService.getSingleRider(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.rider,
      });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.rider });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.rider });
  }
}

async function createRider(req, res) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });

    let fileUrl;
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.rider][0].name;
      if (req?.files?.[fieldName]) {
        fileUrl = await uploadHandler({
          what: fieldName,
          file: req?.files?.[fieldName][0],
        });
      }

      try {
        const addResult = await Rider.create({
          full_name: valid.full_name,
          rider_profile: fileUrl,
          phone: valid.phone,
          email: valid.email,
          password: valid.password,
          vehicle_type: valid.vehicle_type,
          driver_license: valid.driver_license,
          gender: valid.gender,
          dob: valid.dob,
          address: valid.address,
        });
        sendCreateResponse({
          res,
          what: operableEntities.rider,
          data: addResult,
        });
      } catch (error) {
        removeFile({ fileUrl });
        sendErrorResponse({ res, error, what: operableEntities.rider });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.rider });
  }
}

async function updateRider(req, res) {
  try {
    const {
      full_name,
      password,
      vehicle_type,
      driver_license,
      gender,
      dob,
      address,
      phone,
      email,
      is_active,
    } = req.body;

    const idUpdatableRider = req.params.id;
    let fileUrl;
    let deleteUrl;
    //
    try {
      const updatableRider = await Rider.findById(idUpdatableRider);
      if (updatableRider) {
        let fieldName = fieldsMap[operableEntities.rider][0].name;
        if (req?.files?.[fieldName]) {
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          removeFile({ fileUrl: updatableRider.rider_profile });
        }
        const editResult = await Rider.findByIdAndUpdate(
          idUpdatableRider,
          {
            full_name: full_name ? full_name : updatableRider.full_name,
            phone: phone ? phone : updatableRider.phone,
            email: email ? email : updatableRider.email,
            password: password ? password : updatableRider.password,
            vehicle_type: vehicle_type
              ? vehicle_type
              : updatableRider.vehicle_type,
            driver_license: driver_license
              ? driver_license
              : updatableRider.driver_license,
            gender: gender ? gender : updatableRider.gender,
            dob: dob ? dob : updatableRider.dob,
            address: address ? address : updatableRider.address,
            is_active: is_active ? is_active : updatableRider.is_active,
            rider_profile: fileUrl ? fileUrl : updatableRider.rider_profile,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.rider,
          data: editResult,
        });
      } else {
        res.status(404).send({
          success: false,
          status: 404,
          message: "Id not found",
        });
      }
    } catch (error) {
      console.log("error cash ... ");
      if (req.file.path) {
        await unlinkAsync(req.file.path);
      }
      sendErrorResponse({ res, error, what: operableEntities.rider });
    }
  } catch (error) {
    console.log("error cash ... 2");
    sendErrorResponse({ res, error, what: operableEntities.rider });
  }
}
//
async function getRiders(req, res) {
  const result = await riderService.getRiders(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.rider });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.rider });
  }
}
//
async function deleteRider(req, res) {
  const result = await riderService.deleteRider(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.rider });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.rider });
  }
}
//
module.exports = {
  createRider,
  updateRider,
  deleteRider,
  getRiders,
  getSingleRider,
};
