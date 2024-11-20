/* eslint-disable no-unused-vars */
const { operableEntities } = require("../config/constants");
const Staff = require("../models/staff.model");
const { getSearchAndPagination } = require("../utils/pagination");

async function createStaff(data) {
  try {
    const addResult = await Staff.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getStaff(query) {
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

    const fetchResult = await Staff.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Staff.countDocuments(filterConditions);
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
async function updateStaff({ id, data }) {
  try {
    const editResult = await Staff.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteStaff(id) {
  try {
    const deleteResult = await Staff.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaff,
};
