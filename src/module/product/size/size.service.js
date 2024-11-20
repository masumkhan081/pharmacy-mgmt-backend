/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Size = require("./size.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createSize(data) {
  try {
    const addResult = await Size.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateSize({ id, data }) {
  try {
    const updateResult = await Size.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getSingleSize(id) {
  try {
    const fetchResult = await Size.findById(id);
    return fetchResult;
  } catch (error) {
    return error;
  }
}
//
async function updateSizeStatus({ id, is_active }) {
  try {
    const updateResult = await Size.findByIdAndUpdate(
      id,
      { is_active },
      {
        new: true,
      }
    );
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getSizes(query) {
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

    filterData = query?.["is_active"];
    if (filterData === true || filterData === false) {
      filterConditions["is_active"] = filterData;
    }

    const fetchResult = await Size.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Size.countDocuments(filterConditions);
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
async function deleteSize(id) {
  try {
    const deleteResult = await Size.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}
//
module.exports = {
  createSize,
  updateSize,
  deleteSize,
  getSizes,
  getSingleSize,
  updateSizeStatus,
};
