const { Router } = require("express");
const router = Router();
const aboutUsController = require("./aboutUs.controller");
//
router.post("/", aboutUsController.createAboutUs);
router.get("/", aboutUsController.getAboutUs);
router.patch("/:id", aboutUsController.updateAboutUs);
router.delete("/:id", aboutUsController.deleteAboutUs);

module.exports = router;
