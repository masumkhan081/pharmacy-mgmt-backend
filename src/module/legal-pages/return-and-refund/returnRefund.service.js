/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const ReturnRefund = require("./returnRefund.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//

async function createReturnRefund(data) {
  try {
    const addResult = await ReturnRefund.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}

//
async function updateReturnRefund({ id, data }) {
  try {
    const updateResult = await ReturnRefund.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}

async function getReturnRefund(query) {
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

    const fetchResult = await ReturnRefund.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await ReturnRefund.countDocuments(filterConditions);
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
async function deleteReturnRefund(id) {
  try {
    const deleteResult = await ReturnRefund.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createReturnRefund,
  updateReturnRefund,
  deleteReturnRefund,
  getReturnRefund,
};
