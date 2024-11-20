/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const TktType = require("./tktType.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createTktType(data) {
  try {
    const addResult = await TktType.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateTktType({ id, data }) {
  try {
    const editResult = await TktType.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteTktType(id) {
  try {
    const deleteResult = await TktType.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

async function getTktTypes(query) {
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
      what: operableEntities.ticket_type,
    });

    const fetchResult = await TktType.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await TktType.countDocuments(filterConditions);
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
  createTktType,
  updateTktType,
  deleteTktType,
  getTktTypes,
};
