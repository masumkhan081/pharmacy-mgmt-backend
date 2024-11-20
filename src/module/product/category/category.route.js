const { Router } = require("express");
const router = Router();
const categoryController = require("./category.controller");
const { uploadCatThumbnail } = require("../../../utils/uploader");
//
router.post("/", uploadCatThumbnail, categoryController.createProductCategory);
router.patch("/:id", uploadCatThumbnail, categoryController.updateCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getSingleCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
