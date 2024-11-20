/* eslint-disable no-unused-vars */
const { operableEntities } = require("../config/constants");
const Support = require("../models/support.model");
const { getSearchAndPagination } = require("../utils/pagination");

async function createSupport(data) {
  try {
    const addResult = await Support.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getSupports(query) {
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

    const fetchResult = await Support.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Support.countDocuments(filterConditions);
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
async function updateSupport({ id, data }) {
  try {
    const editResult = await Support.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteSupport(id) {
  try {
    const deleteResult = await Support.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createSupport,
  updateSupport,
  deleteSupport,
  getSupports,
};
