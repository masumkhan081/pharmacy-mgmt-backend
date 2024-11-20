/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const DeliveryCharge = require("./delCharge.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createDeliveryCharge(data) {
  try {
    const addResult = await DeliveryCharge.createDeliveryCharge(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getDeliveryCharges(query) {
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
      what: operableEntities.delivery_charge,
    });

    const fetchResult = await DeliveryCharge.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await DeliveryCharge.countDocuments(filterConditions);
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
async function updateDeliveryCharge({ id, data }) {
  try {
    const editResult = await DeliveryCharge.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteDeliveryCharge(id) {
  try {
    const deleteResult = await DeliveryCharge.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  getDeliveryCharges,
};
