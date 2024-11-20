function isPostBodyValid({ files, bodyData }) {
  const { title, display_page, is_active } = bodyData;

  if (title === undefined || title === "") {
    return { success: false, message: "Ad title is missing" };
  } else if (!files["ad_thumbnail"]) {
    return { success: false, message: "Ad thumbnail is missing" };
  } else {
    return {
      success: true,
      title,
      display_page,
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
