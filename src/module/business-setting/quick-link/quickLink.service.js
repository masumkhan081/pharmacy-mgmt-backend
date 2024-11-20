/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const QuickLink = require("./quickLink.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createQuickLink(data) {
  try {
    const addResult = await QuickLink.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateQuickLink({ id, data }) {
  try {
    const editResult = await QuickLink.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteQuickLink(id) {
  try {
    const deleteResult = await QuickLink.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

async function getQuickLinks(query) {
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
      what: operableEntities.q,
    });

    const fetchResult = await QuickLink.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await QuickLink.countDocuments(filterConditions);
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
  createQuickLink,
  updateQuickLink,
  deleteQuickLink,
  getQuickLinks,
};
