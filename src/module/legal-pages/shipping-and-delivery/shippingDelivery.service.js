/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const ShippingDeliveryPolicy = require("./shippingDelivery.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createShippingDeliveryPolicy(data) {
  try {
    const addResult = await ShippingDeliveryPolicy.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updateShippingDeliveryPolicy({ id, data }) {
  try {
    const updateResult = await ShippingDeliveryPolicy.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
    return updateResult;
  } catch (error) {
    return error;
  }
}

async function getShippingDeliveryPolicy(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.sub_categoy });

    const fetchResult = await ShippingDeliveryPolicy.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit)
      .populate("category");

    const total = await ShippingDeliveryPolicy.countDocuments(filterConditions);
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
async function deleteShippingDeliveryPolicy(id) {
  try {
    const deleteResult = await ShippingDeliveryPolicy.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  deleteShippingDeliveryPolicy,
  createShippingDeliveryPolicy,
  updateShippingDeliveryPolicy,
  getShippingDeliveryPolicy,
};
