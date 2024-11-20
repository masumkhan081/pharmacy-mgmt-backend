/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const WithdrawSetting = require("./withdrawSetup.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createWithdrawSetting(data) {
  try {
    const addResult = await WithdrawSetting.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getWithdrawSettings(query) {
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
      what: operableEntities.business_setup,
    });

    const fetchResult = await WithdrawSetting.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await WithdrawSetting.countDocuments(filterConditions);
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
async function updateWithdrawSetting({ id, data }) {
  try {
    const editResult = await WithdrawSetting.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteWithdrawSetting(id) {
  try {
    const deleteResult = await WithdrawSetting.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createWithdrawSetting,
  updateWithdrawSetting,
  deleteWithdrawSetting,
  getWithdrawSettings,
};
