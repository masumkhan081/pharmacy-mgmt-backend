/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../config/constants");
const Shop = require("./shop.model");
const { getSearchAndPagination } = require("../../utils/pagination");
//
async function getShops(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.shop });

    const fetchResult = await Shop.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Shop.countDocuments(filterConditions);
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
async function deleteShop(id) {
  try {
    const deleteResult = await Shop.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  deleteShop,
  getShops,
};
