const { Router } = require("express");
const router = Router();
const subCategoryController = require("./subCategory.controller");
const { uploadSubCatThumbnail } = require("../../../utils/uploader");

router.post(
  "/",
  uploadSubCatThumbnail,
  subCategoryController.createSubCategory
);
router.get("/", subCategoryController.getSubCategories);
router.get("/:id", subCategoryController.getSingleSubCategory);
router.patch(
  "/:id",
  uploadSubCatThumbnail,
  subCategoryController.updateSubCategory
);
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
