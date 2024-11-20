function isPostBodyValid({ files, bodyData }) {
  const {
    name,
    description,
    short_description,
    category,
    sub_category,
    color,
    brand,
    size,
    unit,
    sku,
    shop,
    buying_price,
    selling_price,
    discount_price,
    minimum_order_quantity,
    current_stock_quantity,
  } = bodyData;

  let arr_sub_categories = [];
  let arr_colors = [];
  let arr_sizes = [];

  if (sub_category) {
    arr_sub_categories = sub_category.split(",");
  }
  if (color) {
    arr_colors = color.split(",");
  }
  if (size) {
    arr_sizes = size.split(",");
  }

  if (name === undefined || name === "") {
    return { success: false, message: "Product name is missing" };
  } else if (description === undefined || description === "") {
    return { success: false, message: "Need a product description" };
  } else if (short_description === undefined || short_description === "") {
    return { success: false, message: "SHort description is missing " };
  } else if (category === undefined || category === "") {
    return { success: false, message: "Must select product category" };
  } else if (sku === undefined || sku === "") {
    return { success: false, message: "Stock keeping unit is required" };
  } else if (buying_price === undefined || buying_price < 1) {
    return { success: false, message: "Provide valid buying price" };
  } else if (selling_price === undefined || selling_price < 0) {
    return { success: false, message: "Selling price is required" };
  } else if (
    current_stock_quantity === undefined ||
    current_stock_quantity === ""
  ) {
    return { success: false, message: "Current stock amount is required" };
  } else {
    return {
      success: true,
      name,
      description,
      short_description,
      category,
      sub_category: arr_sub_categories,
      color: arr_colors,
      brand,
      size: arr_sizes,
      unit,
      sku,
      shop,
      buying_price,
      selling_price,
      discount_price,
      product_approval: "PENDING",
      is_active: false,
      minimum_order_quantity,
      current_stock_quantity,
    };
  }
}
function isPatchBodyValid({ updatable, role, bodyData }) {
  const {
    name,
    description,
    short_description,
    category,
    sub_category,
    color,
    brand,
    size,
    unit,
    sku,
    shop,
    buying_price,
    selling_price,
    discount_price,
    product_status,
    minimum_order_quantity,
    current_stock_quantity,
  } = bodyData;

  let arr_sub_categories = sub_category
    ? sub_category.split(",")
    : updatable.sub_category;
  let arr_colors = color ? color.split(",") : updatable.color;
  let arr_sizes = size ? size.split(",") : updatable.size;

  return {
    name: name ? name : updatable.name,
    description: description ? description : updatable.description,
    short_description: short_description
      ? short_description
      : updatable.short_description,
    category: category ? category : updatable.category,
    sub_category: arr_sub_categories,
    color: arr_colors,
    brand: brand ? brand : updatable.brand,
    size: arr_sizes,
    unit: unit ? unit : updatable.unit,
    sku: sku ? sku : updatable.sku,
    shop: shop ? shop : updatable.shop,
    buying_price: buying_price ? buying_price : updatable.buying_price,
    selling_price: selling_price ? selling_price : updatable.selling_price,
    discount_price: discount_price ? discount_price : updatable.discount_price,
    product_status: product_status ? product_status : updatable.product_status,
    minimum_order_quantity: minimum_order_quantity
      ? minimum_order_quantity
      : updatable.minimum_order_quantity,
    current_stock_quantity: current_stock_quantity
      ? current_stock_quantity
      : updatable.current_stock_quantity,
  };
}

module.exports = { isPostBodyValid, isPatchBodyValid };
