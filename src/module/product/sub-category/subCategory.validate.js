const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');


function isPostBodyValid({ files, bodyData }) {
  const { name, is_active, category, description } = bodyData;

  if (name === undefined || name === "") {
    return { success: false, message: "Sub category name is missing" };
  }
  if (category === undefined || category === "") {
    return { success: false, message: "Select a category first" };
  } else {
    // const categories = category.slice(1, category.length - 1).split(",");

    

    return {
      success: true,
      name,
      category,
      is_active: is_active ? is_active : false,
      description,
    };
  }
}
function isPatchBodyValid({ name, is_active, description, category }) {
  // var form = new multiparty.Form();
  // form.parse(req, function (err, fields, files) {

  if (name && category) {
    return { success: true, name, is_active, description, category };
  } else {
    return { success: false, name, is_active, description, category };
  }
}

module.exports = { isPostBodyValid, isPatchBodyValid };
