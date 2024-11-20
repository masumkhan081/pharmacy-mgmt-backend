const brandService = require("./brand.service");
const Brand = require("./brand.model");
const Product = require("../product/product.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
  responseMap,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { isPostBodyValid } = require("./brand.validate");
const { fieldsMap, uploadHandler } = require("../../../utils/uploader");
//

async function createBrand(req, res) {
  try {
    let logo;

    let fieldName = fieldsMap[operableEntities.brand][0].name;
    if (req.files?.[fieldName]) {
      logo = await uploadHandler({
        what: fieldName,
        file: req.files[fieldName][0],
      });
    }
    const result = await brandService.createBrand({
      name: req.body.name,
      logo,
    });
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.brand });
    } else {
      sendCreateResponse({ res, data: result, what: operableEntities.brand });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}

async function getBrands(req, res) {
  try {
    const result = await brandService.getBrands(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.brand });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.brand });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}
async function getSingleBrand(req, res) {
  try {
    const result = await brandService.getSingleBrand(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.brand });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.brand });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}

async function updateBrandStatus(req, res) {
  try {
    const exist = await Brand.findById(req.params.id);
    if (exist) {
      const result = await brandService.updateBrandStatus({
        id: req.params.id,
        is_active: req.body.is_active,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.brand });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.brand });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.brand,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}
//
async function updateBrand(req, res) {
  try {
    const exist = await Brand.findById(req.params.id);
    if (exist) {
      let data = {};
      if (req.body?.name) {
        data.name = req.body?.name;
      }
      let fieldName = fieldsMap[operableEntities.brand][0].name;
      if (req.files?.[fieldName]) {
        data["logo"] = await uploadHandler({
          what: fieldName,
          file: req.files[fieldName][0],
        });
      }
      const result = await brandService.updateBrand({
        id: req.params.id,
        data,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.brand });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.brand });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.brand,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}
//
async function deleteBrand(req, res) {
  try {
    const exist = await Brand.findById(req.params.id);
    if (exist) {
      const isUsed = await Product.countDocuments({
        brand: req.params.id,
      });

      if (isUsed === 0) {
        const result = await brandService.deleteBrand(req.params.id);
        if (result instanceof Error) {
          sendErrorResponse({
            res,
            error: result,
            what: operableEntities.brand,
          });
        } else {
          sendDeletionResponse({
            res,
            data: result,
            what: operableEntities.brand,
          });
        }
      } else {
        sendErrorResponse({
          res,
          error: responseMap.already_used,
          what: operableEntities.brand,
        });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.brand,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.brand });
  }
}
//
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  getSingleBrand,
  updateBrandStatus,
};
