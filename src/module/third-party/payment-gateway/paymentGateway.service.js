/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const PaymentGateway = require("./paymentGateway.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createPaymentGateway(data) {
  try {
    const addResult = await PaymentGateway.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getPaymentGateway(query) {
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
      what: operableEntities.payment_gateway,
    });

    const fetchResult = await PaymentGateway.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await PaymentGateway.countDocuments(filterConditions);
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
async function updatePaymentGateway({ id, data }) {
  try {
    const editResult = await PaymentGateway.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deletePaymentGateway(id) {
  try {
    const deleteResult = await PaymentGateway.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
  getPaymentGateway,
};
