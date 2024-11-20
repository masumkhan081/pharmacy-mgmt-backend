function isPostBodyValid({
  code,
  discount_type,
  discount_amount,
  max_discount_amount,
  min_order_amount,
  order_limit,
  start_time,
  expire_time,
  is_active,
}) {
  if (code === undefined || code === "") {
    return { success: false, message: "Code voucher is missing" };
  } else if (discount_type === undefined || discount_type === "") {
    return { success: false, message: "Define discount type" };
  } else if (discount_amount === undefined || discount_amount === "") {
    return { success: false, message: "Discount amount is missing" };
  } else if (min_order_amount === undefined || min_order_amount === "") {
    return { success: false, message: "Minimum order amount is missing" };
  } else if (start_time === undefined || start_time === "") {
    return { success: false, message: "Coupon start time is required" };
  } else if (expire_time === undefined || expire_time === "") {
    return { success: false, message: "Coupon expire time is required" };
  } else {
    return {
      success: true,
      code,
      discount_type,
      discount_amount,
      max_discount_amount,
      min_order_amount,
      order_limit,
      start_time,
      expire_time,
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
