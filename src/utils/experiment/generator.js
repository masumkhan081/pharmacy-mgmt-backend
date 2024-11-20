const fs = require("fs");

const operableEntities = {
  product: "Products",
  product_category: "Product categories",
  product_request: "Product requests",
  // business setting
  business_setup: "Business setup",
  delivery_charge: "Delivery charge",
  general_setting: "General setting",
  social_link: "Social link",
  theme_color: "Theme color",
  // legal-page
  contact_us: "Contact",
  // third-party
  payment_gateway: "Payment gateway",
  sms_gateway: "SMS gateway",
  mail_config: "Mail configuration",
  // promotion management
  ad: "Ad",
  banner: "Banner",
  coupon: "Coupon",
  notification: "Notification",
  //
  rider: "Riders",
  shop: "Shop",
  order: "Order",
  delivery: "Delivery",
  users: "Users",
  customer: "Customer",
  sale: "Sale",
  sale_return: "Sale Return",
  support: "Support",
  staff: "Staff",
  brand: "Brand",
  unit: "Units",
  size: "Size",
  color: "Color",
  profile: "Profile",
  user: "User",
};

const srcFileRoute = "./address.route.js";
const srcFileController = "address.controller.js";
const srcFileService = "./address.service.js";
const srcFileModel = "./customer.model.js";
const srcFileValidate = "./address.validate.js";
//
function copy() {
  Object.keys(operableEntities).map((key) => {
    fs.copyFile(
      srcFileValidate,
      `./src/validation/${key}.validate.js`,
      (err) => {
        if (err) {
          console.log("Error Found:", err);
        } else {
          console.log("done !");
        }
      }
    );
  });
}

function createDir() {
  Object.keys(operableEntities).map((key) => {
    fs.mkdir(`./module/${key}`, (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log("done !");
      }
    });
  });
}

function moveFile() {
  Object.keys(operableEntities).map((key) => {
    const oldPath = `./models/${key}.model.js`;
    const newPath = `./module/${key}/${key}.model.js`;
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log("done !");
      }
    });
  });
}


moveFile();
// copy();
// createDir();
