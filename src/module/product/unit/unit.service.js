/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Unit = require("./unit.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createUnit(data) {
  try {
    const addResult = await Unit.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getSingleUnit(id) {
  try {
    const fetchResult = await Unit.findById(id);
    return fetchResult;
  } catch (error) {
    return error;
  }
}
//
async function updateUnit({ id, data }) {
  try {
    const updateResult = await Unit.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}

//
async function getUnits(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.unit });

    filterData = query?.["is_active"];
    if (filterData === true || filterData === false) {
      filterConditions["is_active"] = filterData;
    }

    const fetchResult = await Unit.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Unit.countDocuments(filterConditions);
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
async function deleteUnit(id) {
  try {
    const deleteResult = await Unit.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  deleteUnit,
  getUnits,
  createUnit,
  updateUnit,
  getSingleUnit,
};
