function isPostBodyValid({ files, bodyData }) {
  const { name, link, is_active } = bodyData;
  if (name === undefined || name === "") {
    return { success: false, message: "Social site name is missing" };
  } else if (link === undefined || link === "") {
    return { success: false, message: "Social site link is missing" };
  } else {
    return {
      success: true,
      name,
      link,
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
