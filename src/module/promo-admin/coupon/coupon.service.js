/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Coupon = require("./coupon.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createCoupon(data) {
  try {
    const addResult = await Coupon.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getCoupons(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.coupon });

    const fetchResult = await Coupon.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit)
      .populate("shop");

    const total = await Coupon.countDocuments(filterConditions);
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
async function updateCoupon({ id, data }) {
  try {
    const editResult = await Coupon.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteCoupon(id) {
  try {
    const deleteResult = await Coupon.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons,
};
