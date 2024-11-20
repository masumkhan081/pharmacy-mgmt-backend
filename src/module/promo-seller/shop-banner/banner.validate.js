function isPostBodyValid({ files, bodyData }) {
  const { title, is_active } = bodyData;

  if (title === undefined || title === "") {
    return { success: false, message: "Banner title is missing" };
  } else if (!files["shop_banner"]) {
    return { success: false, message: "Shop banner is missing" };
  } else {
    return { success: true, title, is_active: is_active ? is_active : false };
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
