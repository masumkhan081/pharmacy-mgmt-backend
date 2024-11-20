/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const SubCategory = require("./subCategory.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

//
async function getSingleSubCategory(updatableId) {
  try {
    const getResult = await SubCategory.findById(updatableId).populate(
      "category"
    );
    return getResult;
  } catch (error) {
    return error;
  }
}

async function getSubCategories(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.sub_category });

    if (query?.["is_active"]) {
      filterConditions["is_active"] = query?.["is_active"];
    }
    if (query?.["category"]) {
      try {
        filterConditions["category"] = query?.["category"];
      } catch (error) {
        console.log("err:  cating error");
      }
    }

    const fetchResult = await SubCategory.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit)
      .populate("category");

    const total = await SubCategory.countDocuments(filterConditions);
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
async function deleteSubCategory(id) {
  try {
    const deleteResult = await SubCategory.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  deleteSubCategory,
  getSubCategories,
  getSingleSubCategory,
};
