// const bcrypt = require("bcrypt");
// const { getHashedPassword } = require("../../../utils/tokenisation");

function isPostBodyValid({ files, bodyData }) {
  const {
    full_name,
    phone,
    email,
    password,
    vehicle_type,
    driver_license,
    gender,
    dob,
    address,
    is_active,
  } = bodyData;

  console.log(
    full_name,
    phone,
    email,
    password,
    vehicle_type,
    driver_license,
    gender,
    dob,
    address,
    is_active
  );

  // const hashedPassword = getHashedPassword(password);
  // const hashedPassword = password;

  if (full_name === undefined || full_name === "") {
    return { success: false, message: "Full name is missing" };
  } else if (gender === undefined || gender === "") {
    return { success: false, message: "Please select gender" };
  } else if (dob === undefined || dob === "") {
    return { success: false, message: "Please provide date of birth" };
  } else {
    return {
      success: true,
      full_name,
      phone,
      email,
      password,
      vehicle_type,
      driver_license,
      gender,
      dob,
      address,
      is_active: is_active ? is_active : false,
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
