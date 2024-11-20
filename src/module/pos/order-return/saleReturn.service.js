/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../config/constants");
const Address = require("../../models/address.model");
const { getSearchAndPagination } = require("../../utils/pagination");

async function createAddress(data) {
  try {
    const addResult = await Address.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getAddresses(query) {
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

    const fetchResult = await Address.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Address.countDocuments(filterConditions);
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
async function updateAddress({ id, data }) {
  try {
    const editResult = await Address.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteAddress(id) {
  try {
    const deleteResult = await Address.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
};
