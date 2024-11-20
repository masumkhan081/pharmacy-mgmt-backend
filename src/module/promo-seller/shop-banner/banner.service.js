/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Banner = require("./banner.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createBanner(data) {
  try {
    const addResult = await Banner.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getBanners(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.banner });

    const fetchResult = await Banner.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Banner.countDocuments(filterConditions);
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
async function updateBanner({ id, data }) {
  try {
    const editResult = await Banner.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteBanner(id) {
  try {
    const deleteResult = await Banner.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createBanner,
  updateBanner,
  deleteBanner,
  getBanners,
};
