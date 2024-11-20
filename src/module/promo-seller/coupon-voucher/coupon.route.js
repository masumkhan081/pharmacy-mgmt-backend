const { Router } = require("express");
const router = Router();
const couponController = require("./coupon.controller");
// const validateRequest = require("../../../middlewares/validateRequest");
const { isPostBodyValid, isPatchBodyValid } = require("./coupon.validate");
//
router.post("/", couponController.createCouponVoucher);
router.get("/", couponController.getCouponVouchers);
router.patch("/:id", couponController.updateCouponVoucher);
router.delete("/:id", couponController.deleteCouponVoucher);

module.exports = router;
