/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants"); 
const { getSearchAndPagination } = require("../../../utils/pagination");
const AboutUs = require("./aboutUs.model");
//
async function createAboutUs(data) {
  try {
    const addResult = await AboutUs.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateAboutUs({ id, data }) {
  try {
    const updateResult = await AboutUs.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getAboutUs(query) {
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

    const fetchResult = await AboutUs.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await AboutUs.countDocuments(filterConditions);
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
async function deleteAboutUs(id) {
  try {
    const deleteResult = await AboutUs.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}
//
module.exports = {
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
  getAboutUs,
};
