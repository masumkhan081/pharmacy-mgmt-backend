/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Cart = require("./cart.model");
const Order = require("../order/order.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createOrderFromCart(data) {}
//
async function createCart(data) {
  try {
    const cart = await Cart.create(data);
    return cart;
  } catch (error) {
    console.log("service : create :  " + error.message);
    return error;
  }
}
//
async function getCarts(query) {
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

    const fetchResult = await Cart.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Cart.countDocuments(filterConditions);
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
    console.log("service : get :  " + error.message);
    return error;
  }
}
//
async function updateCart({ id, data }) {
  try {
    console.log(JSON.stringify(data));
    const editResult = await Cart.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    console.log("service : update :  " + error.message);
    return error;
  }
}
//
async function deleteCart(id) {
  try {
    const deleteResult = await Cart.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createOrderFromCart,
  createCart,
  updateCart,
  deleteCart,
  getCarts,
};
