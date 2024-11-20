const { Router } = require("express");
const router = Router();
const addressController = require("../controller/address.controller");
const validateRequest = require("../middlewares/validateRequest");
const addressSchema = require("../validation/address.validate");
//

router.post("/", validateRequest(addressSchema), addressController.createAddress);
router.get("/", addressController.getAddresses);
router.patch("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
