/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const ThemeColor = require("./themeColor.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createThemeColor(data) {
  try {
    const addResult = await ThemeColor.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateThemeColor({ id, data }) {
  try {
    const editResult = await ThemeColor.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteThemeColor(id) {
  try {
    const deleteResult = await ThemeColor.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

async function getThemeColors(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.theme_color });

    const fetchResult = await ThemeColor.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await ThemeColor.countDocuments(filterConditions);
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

module.exports = {
  createThemeColor,
  updateThemeColor,
  deleteThemeColor,
  getThemeColors,
};
