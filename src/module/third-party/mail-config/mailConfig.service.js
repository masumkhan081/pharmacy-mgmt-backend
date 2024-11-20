/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const MailConfig = require("./mailConfig.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createMailConfig(data) {
  try {
    const addResult = await MailConfig.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getMailConfig(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.mail_config });

    const fetchResult = await MailConfig.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await MailConfig.countDocuments(filterConditions);
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
async function updateMailConfig({ id, data }) {
  try {
    const editResult = await MailConfig.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteMailConfig(id) {
  try {
    const deleteResult = await MailConfig.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createMailConfig,
  updateMailConfig,
  deleteMailConfig,
  getMailConfig,
};
