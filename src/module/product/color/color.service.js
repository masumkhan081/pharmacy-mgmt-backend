/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Color = require("./color.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
// 
//
async function getSingleColor(id) {
  try {
    const fetchResult = await Color.findById(id);
    return fetchResult;
  } catch (error) {
    return error;
  }
}

async function createColor(data) {
  try {
    const addResult = await Color.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getColors(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.color });

    filterData = query?.["is_active"];
    if (filterData === true || filterData === false) {
      filterConditions["is_active"] = filterData;
    }
    //

    const fetchResult = await Color.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Color.countDocuments(filterConditions);
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
async function updateColor({ id, data }) {
  try {
    const editResult = await Color.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteColor(id) {
  try {
    const deleteResult = await Color.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColors,
  getSingleColor
};
