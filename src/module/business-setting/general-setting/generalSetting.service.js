/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const GeneralSetting = require("./generalSetting.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createGeneralSetting(data) {
  try {
    const addResult = await GeneralSetting.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getGeneralSettings(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.general_setting });

    const fetchResult = await GeneralSetting.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await GeneralSetting.countDocuments(filterConditions);
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
async function updateGeneralSetting({ id, data }) {
  try {
    const editResult = await GeneralSetting.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteGneeralSetting(id) {
  try {
    const deleteResult = await GeneralSetting.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createGeneralSetting,
  updateGeneralSetting,
  deleteGneeralSetting,
  getGeneralSettings,
};
