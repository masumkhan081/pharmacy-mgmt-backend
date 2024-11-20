const { Router } = require("express");
const router = Router();
const couponController = require("./coupon.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { couponSchema } = require("./coupon.validate");
//
router.post("/", validateRequest(couponSchema) , couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.patch("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
