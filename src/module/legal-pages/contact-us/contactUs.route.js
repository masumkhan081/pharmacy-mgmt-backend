const { Router } = require("express");
const router = Router();
const contactUsController = require("./contactUs.controller");
const { isPatchBodyValid, isPostBodyValid } = require("./contactUs.validate");
//

router.post("/", contactUsController.createContactUs);
router.get("/", contactUsController.getContactUs);
router.patch("/:id", contactUsController.updateContactUs);
router.delete("/:id", contactUsController.deleteContactUs);

module.exports = router;
