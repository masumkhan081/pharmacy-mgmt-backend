/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const TermCondition = require("./termCondition.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createTermCondition(data) {
  try {
    const addResult = await TermCondition.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateTermCondition({ id, data }) {
  try {
    const updateResult = await TermCondition.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getTermCondition(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.terms_and_conditions });

    const fetchResult = await TermCondition.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await TermCondition.countDocuments(filterConditions);
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
async function deleteTermCondition(id) {
  try {
    const deleteResult = await TermCondition.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}
//
module.exports = {
  createTermCondition,
  updateTermCondition,
  deleteTermCondition,
  getTermCondition,
};
