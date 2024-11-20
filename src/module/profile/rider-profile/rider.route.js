const { Router } = require("express");
const router = Router();
const riderController = require("./rider.controller");
const { isPatchBodyValid, isPostBodyValid } = require("./rider.validate");
const { uploadRiderProfile } = require("../../../utils/uploader");

//
router.post("/", uploadRiderProfile, riderController.createRider);
router.get("/", riderController.getRiders);
router.get("/:id", riderController.getSingleRider);

router.patch("/:id", uploadRiderProfile, riderController.updateRider);
router.delete("/:id", riderController.deleteRider);

module.exports = router;
