/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const CouponVoucher = require("./coupon.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createCouponVoucher(data) {
  try {
    const addResult = await CouponVoucher.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getCouponVouchers(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({
      query,
      what: operableEntities.coupon_voucher,
    });

    const fetchResult = await CouponVoucher.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await CouponVoucher.countDocuments(filterConditions);
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
async function updateCouponVoucher({ id, data }) {
  try {
    const editResult = await CouponVoucher.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteCouponVoucher(id) {
  try {
    const deleteResult = await CouponVoucher.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createCouponVoucher,
  updateCouponVoucher,
  deleteCouponVoucher,
  getCouponVouchers,
};
