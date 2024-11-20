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
const { isPostBodyValid } = require("./coupon.validate");
//
async function createCouponVoucher(req, res) {
  try {
    const valid = isPostBodyValid(req.body);

    if (valid.success) {
      const result = await couponService.createCouponVoucher(req.body);
      if (result instanceof Error) {
        sendErrorResponse({
          res,
          error: result,
          what: operableEntities.coupon_voucher,
        });
      } else {
        sendCreateResponse({
          res,
          data: result,
          what: operableEntities.coupon_voucher,
        });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.coupon_voucher });
  }
}
//
async function getCouponVouchers(req, res) {
  try {
    console.log("1 ---- ");
    const result = await couponService.getCouponVouchers(req.query);
    console.log("2 ---- ");

    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.coupon_voucher,
      });
    } else {
      sendFetchResponse({
        res,
        data: result,
        what: operableEntities.coupon_voucher,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.coupon_voucher });
  }
}
//
async function updateCouponVoucher(req, res) {
  try {
    const result = await couponService.updateCouponVoucher({
      id: req.params.id,
      data: req.body,
    });
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.coupon_voucher,
      });
    } else {
      sendUpdateResponse({
        res,
        data: result,
        what: operableEntities.coupon_voucher,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.coupon_voucher });
  }
}
//
async function deleteCouponVoucher(req, res) {
  try {
    const result = await couponService.deleteCouponVoucher(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.coupon_voucher,
      });
    } else {
      sendDeletionResponse({
        res,
        data: result,
        what: operableEntities.coupon_voucher,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.coupon_voucher });
  }
}
//
module.exports = {
  createCouponVoucher,
  updateCouponVoucher,
  deleteCouponVoucher,
  getCouponVouchers,
};
