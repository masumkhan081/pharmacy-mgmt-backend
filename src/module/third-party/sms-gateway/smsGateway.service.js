/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const SmsGateway = require("./smsGateway.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createSmsGateway(data) {
  try {
    const addResult = await SmsGateway.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getSmsGateway(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.sms_gateway });

    const fetchResult = await SmsGateway.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await SmsGateway.countDocuments(filterConditions);
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
async function updateSmsGateway({ id, data }) {
  try {
    const editResult = await SmsGateway.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteSmsGateway(id) {
  try {
    const deleteResult = await SmsGateway.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createSmsGateway,
  updateSmsGateway,
  deleteSmsGateway,
  getSmsGateway,
};
