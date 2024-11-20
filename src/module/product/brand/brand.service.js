/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Brand = require("./brand.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createBrand({ name, logo }) {
  try {
    const addResult = await Brand.create({ name, logo });
    return addResult;
  } catch (error) {
    console.log("err-2");
    return error;
  }
}

//
async function updateBrand({ id, data }) {
  try {
    const updateResult = await Brand.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function updateBrandStatus({ id, is_active }) {
  try {
    const updateResult = await Brand.findByIdAndUpdate(
      id,
      { is_active },
      {
        new: true,
      }
    );
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getSingleBrand(id) {
  try {
    const fetchResult = await Brand.findById(id);
    return fetchResult;
  } catch (error) {
    return error;
  }
}

//
async function getBrands(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.brand });

    const fetchResult = await Brand.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Brand.countDocuments(filterConditions);
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
async function deleteBrand(id) {
  try {
    const deleteResult = await Brand.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    console.log("error.message:  " + error.message);
    return error;
  }
}
//
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  getSingleBrand,
  updateBrandStatus,
};
