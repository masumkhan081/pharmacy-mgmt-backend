function isPostBodyValid({ files, bodyData }) {
  const { name, is_active, description } = bodyData;

  if (name === undefined || name === "") {
    return { success: false, message: "Category name is missing" };
  } else {
    return {
      success: true,
      name,
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
