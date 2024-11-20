const { Router } = require("express");
const router = Router();
const socialLinkController = require("./socialLink.controller");
const { uploadSocialLink } = require("../../../utils/uploader");
//
router.post("/", uploadSocialLink, socialLinkController.createSocialLink);
router.get("/", socialLinkController.getSocialLinks);
router.patch("/:id", uploadSocialLink, socialLinkController.updateSocialLink);
router.delete("/:id", socialLinkController.deleteSocialLink);

module.exports = router;
