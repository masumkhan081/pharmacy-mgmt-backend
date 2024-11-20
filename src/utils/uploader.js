const multer = require("multer");
const upload = multer({ dest: "../../public/" });
const { storageMap } = require("./fileHandle");
const { operableEntities } = require("../config/constants");
const fs = require("fs");
const path = require("path");

const fieldsMap = {
  [operableEntities.brand]: [
    { name: "brand_logo", maxCount: 1, required: true },
  ],
  // promotion mgmt - admin
  [operableEntities.banner]: [
    { name: "banner_thumbnail", maxCount: 1, required: true },
  ],
  [operableEntities.ad]: [
    { name: "ad_thumbnail", maxCount: 1, required: true },
  ],
  //  category sub-category  -admin
  [operableEntities.category]: [
    { name: "cat_thumbnail", maxCount: 1, required: true },
  ],
  [operableEntities.sub_category]: [
    { name: "sub_cat_thumbnail", maxCount: 1, required: true },
  ],
  // promotion mgmt - seller
  [operableEntities.shop_banner]: [
    { name: "shop_banner", maxCount: 1, required: true },
  ],
  // business-setting    - admin
  [operableEntities.general_setting]: [
    { name: "website_logo", maxCount: 1, required: true },
    { name: "textual_logo", maxCount: 1, required: true },
  ],
  [operableEntities.social_link]: [
    { name: "social_icon", maxCount: 1, required: true },
  ],
  // shop
  [operableEntities.shop]: [
    { name: "shop_logo", maxCount: 1, required: true },
    { name: "shop_banner", maxCount: 1, required: true },
    { name: "seller_profile", maxCount: 1, required: true },
  ],
  [operableEntities.rider]: [
    { name: "rider_profile", maxCount: 1, required: true },
  ],
  //  product and related  -seller
  [operableEntities.product]: [
    { name: "product_thumbnail", maxCount: 1, required: true },
    { name: "additional_product_thumbnail", maxCount: 5, required: true },
  ],

  //  legal pages   -admin

  // third party config  -admin
};
// --------------------------------------------------------------------------------------------------------------------------------------

const uploadBrandLogo = upload.fields(fieldsMap[operableEntities.brand]);
// shop
const uploadShopCreationFiles = upload.fields(fieldsMap[operableEntities.shop]);
// business setting   - admin
const uploadGeneralSettingFiles = upload.fields(
  fieldsMap[operableEntities.general_setting]
);
const uploadSocialLink = upload.fields(fieldsMap[operableEntities.social_link]);
//   promotion mgtmt  - admin
const uploadAdThumbnail = upload.fields(fieldsMap[operableEntities.ad]);
const uploadBannerThumbnail = upload.fields(fieldsMap[operableEntities.banner]);
const uploadRiderProfile = upload.fields(fieldsMap[operableEntities.rider]);
//   category   subcategory  - admin
const uploadSubCatThumbnail = upload.fields(
  fieldsMap[operableEntities.sub_category]
);
const uploadCatThumbnail = upload.fields(fieldsMap[operableEntities.category]);
//   promotion mgtmt  - seller
const uploadShopBanner = upload.fields(fieldsMap[operableEntities.shop_banner]);
//
const uploadProductImages = upload.fields(fieldsMap[operableEntities.product]);
//
async function uploadHandler({ type, what, file }) {
  try {
    const uploadDir = path.join(__dirname, storageMap[what].destination);
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
    } catch (err) {
      console.log("inner catch");
      console.error(err);
    }
    const readData = fs.readFileSync(file.path);
    // unique name generation
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const newFilePath = `${storageMap[what].save_directory}${basename}-${timestamp}${ext}`;
    //
    const writeData = fs.writeFileSync(newFilePath, readData);
    return newFilePath;
  } catch (error) {
    res.status(400).send({ message: "error processing file" });
  }
}

module.exports = {
  uploadHandler,
  fieldsMap,
  uploadBrandLogo,
  uploadRiderProfile,
  uploadGeneralSettingFiles,
  uploadAdThumbnail,
  uploadBannerThumbnail,
  uploadSocialLink,
  uploadShopCreationFiles,
  uploadShopBanner,
  uploadCatThumbnail,
  uploadSubCatThumbnail,
  uploadProductImages,
};
