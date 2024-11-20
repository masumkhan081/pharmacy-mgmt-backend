/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const ContactUs = require("./contactUs.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createContactUs(data) {
  try {
    const addResult = await ContactUs.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getContactUs(query) {
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

    const fetchResult = await ContactUs.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await ContactUs.countDocuments(filterConditions);
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
async function updateContactUs({ id, data }) {
  try {
    const editResult = await ContactUs.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteContactUs(id) {
  try {
    const deleteResult = await ContactUs.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createContactUs,
  updateContactUs,
  deleteContactUs,
  getContactUs,
};
