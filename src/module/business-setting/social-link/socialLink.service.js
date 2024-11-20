/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const SocialLink = require("./socialLink.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createSocialLink(data) {
  try {
    const addResult = await SocialLink.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateSocialLink({ id, data }) {
  try {
    const editResult = await SocialLink.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteSocialLink(id) {
  try {
    const deleteResult = await SocialLink.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

async function getSocialLinks(query) {
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

    const fetchResult = await SocialLink.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await SocialLink.countDocuments(filterConditions);
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
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinks,
};
