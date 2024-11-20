/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const ShopSetting = require("./shopSetup.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createShopSetting(data) {
  try {
    const addResult = await ShopSetting.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getShopSettings(query) {
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
      what: operableEntities.shop_setting,
    });

    const fetchResult = await ShopSetting.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await ShopSetting.countDocuments(filterConditions);
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
async function updateShopSetting({ id, data }) {
  try {
    const editResult = await ShopSetting.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteShopSetting(id) {
  try {
    const deleteResult = await ShopSetting.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createShopSetting,
  updateShopSetting,
  deleteShopSetting,
  getShopSettings,
};
