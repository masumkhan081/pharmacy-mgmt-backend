const couponService = require("./coupon.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
//
async function createCoupon(req, res) {
  //
  // let data = {
  //   ...req.body,
  //   shop: req.body.shop.split(","),
  // };
  //
  const result = await couponService.createCoupon(req.body);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.coupon });
  } else {
    sendCreateResponse({ res, data: result, what: operableEntities.coupon });
  }
}
//
async function getCoupons(req, res) {
  const result = await couponService.getCoupons(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.coupon });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.coupon });
  }
}
//
async function updateCoupon(req, res) {
  const result = await couponService.updateCoupon({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    console.log("error ...");
    sendErrorResponse({ res, error: result, what: operableEntities.coupon });
  } else {
    console.log("update ...");
    sendUpdateResponse({ res, data: result, what: operableEntities.coupon });
  }
}
//
async function deleteCoupon(req, res) {
  const result = await couponService.deleteCoupon(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.coupon });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.coupon });
  }
}
//
module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons,
};
