/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const BusinessSetup = require("./businessSetup.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createBusinessSetup(data) {
  try {
    const addResult = await BusinessSetup.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getBusinessSetup(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.business_setup  });

    const fetchResult = await BusinessSetup.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await BusinessSetup.countDocuments(filterConditions);
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
async function updateBusinessSetup({ id, data }) {
  try {
    const editResult = await BusinessSetup.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteBusinessSetup(id) {
  try {
    const deleteResult = await BusinessSetup.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createBusinessSetup,
  updateBusinessSetup,
  deleteBusinessSetup,
  getBusinessSetup,
};
