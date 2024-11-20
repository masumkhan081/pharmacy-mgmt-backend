const { Router } = require("express");
const router = Router();
const themeColorController = require("./themeColor.controller");
const { isPatchBodyValid, isPostBodyValid } = require("./themeColor.validate");
//

router.post("/", themeColorController.createThemeColor);
router.get("/", themeColorController.getThemeColors);
router.patch("/:id", themeColorController.updateThemeColor);
router.delete("/:id", themeColorController.deleteThemeColor);

module.exports = router;
