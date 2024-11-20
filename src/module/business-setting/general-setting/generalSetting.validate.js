function isPostBodyValid({ files, bodyData }) {
  const {
    website_name,
    website_title,
    footer_mail,
    footer_phone,
    footer_text,
    footer_address,
    footer_description,
    is_app_link_visible,
    appstore_link,
    playstore_link,
  } = bodyData;

  if (website_name === undefined || website_name === "") {
    return { success: false, message: "Website name is missing" };
  } else if (website_title === undefined || website_title === "") {
    return { success: false, message: "Website title display page" };
  } else if (!files["website_logo"]) {
    return { success: false, message: "Website logo is missing" };
  } else {
    return {
      success: true,
      website_name,
      website_title,
      footer_address,
      footer_description,
      footer_mail,
      footer_phone,
      footer_text,
      playstore_link,
      appstore_link,
      is_app_link_visible: is_app_link_visible ? is_app_link_visible : false,
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
