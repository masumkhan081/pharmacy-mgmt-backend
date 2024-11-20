const { Router } = require("express");
const router = Router();
const quickLinkController = require("./quickLink.controller");
//
router.post("/", quickLinkController.createQuickLink);
router.get("/", quickLinkController.getQuickLinks);
router.patch("/:id", quickLinkController.updateQuickLink);
router.delete("/:id", quickLinkController.deleteQuickLink);

module.exports = router;
