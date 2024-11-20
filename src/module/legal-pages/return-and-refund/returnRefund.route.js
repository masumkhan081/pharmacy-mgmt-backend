const { Router } = require("express");
const router = Router();
const returnRefundController = require("./returnRefund.controller");
const {
  isPatchBodyValid,
  isPostBodyValid,
} = require("./returnRefund.validate");
//
router.post("/", returnRefundController.createReturnRefund);
router.get("/", returnRefundController.getReturnRefunds);
router.patch("/:id", returnRefundController.updateReturnRefund);
router.delete("/:id", returnRefundController.deleteReturnRefund);

module.exports = router;
