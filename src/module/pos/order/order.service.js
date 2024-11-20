/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Order = require("./order.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createOrder({ res, orderData }) {
  // Required fields
  const requiredFields = [
    "products",
    "customer",
    "shipping_address",
    "date_time",
    "payment_method",
    "sub_total",
    "discount",
    "shipping_charge",
    "subtotal_after_discount",
    "total_payable",
    "status",
  ];

  // Check for required fields
  for (const field of requiredFields) {
    if (!orderData[field]) {
      return res
        .status(400)
        .json({ message: `Missing required field: ${field}` });
    }
  }

  // Validate products array
  if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
    return res
      .status(400)
      .json({ message: "Products field must be a non-empty array" });
  }

  const productsErrors = [];

  for (const product of orderData.products) {
    const requiredProductFields = [
      "product",
      "size",
      "color",
      "qty",
      "buying_price",
      "selling_price",
      "discount_price",
      "total_price",
    ];

    for (const field of requiredProductFields) {
      if (!product[field]) {
        productsErrors.push(`Missing required field in product: ${field}`);
      }
    }

    // Additional validation for quantity and prices
    if (product.qty <= 0) {
      productsErrors.push(
        `Quantity must be greater than 0 for product ${product.product}`
      );
    }
    if (
      product.buying_price < 0 ||
      product.selling_price < 0 ||
      product.discount_price < 0 ||
      product.total_price < 0
    ) {
      productsErrors.push(
        `Prices must be non-negative for product ${product.product}`
      );
    }
  }

  // If there are any errors in the products array, respond with the errors
  if (productsErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors in products",
      errors: productsErrors,
    });
  }

  try {
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
  }
}
//
async function getOrders(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.address });

    const fetchResult = await Order.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Order.countDocuments(filterConditions);
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
}
//
async function updateOrder({ id, data }) {
  try {
    const editResult = await Order.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteOrder(id) {
  try {
    const deleteResult = await Order.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
};
