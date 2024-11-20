/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Ad = require("./ad.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

//

async function getSingleAd(updatableId) {
  try {
    const getResult = await Ad.findById(updatableId);
    return getResult;
  } catch (error) {
    return error;
  }
}

async function getAds(query) {
  try {
    let {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.ad });

    // filterConditions.is_active = true;

    const fetchResult = await Ad.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Ad.countDocuments(filterConditions);
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
async function deleteAd(id) {
  try {
    const deleteResult = await Ad.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  deleteAd,
  getAds,
  getSingleAd,
};
