/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Product = require("./product.model");
const { getSearchAndPagination } = require("../../../utils/pagination");

async function createProduct(data) {
  try {
    const addResult = await Product.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//

async function getSingleProduct(id) {
  try {
    const fetchResult = await Product.findById(id)
      .populate("brand")
      .populate("color")
      .populate("category")
      .populate("sub_category")
      .populate("size")
      .populate("unit");
    return fetchResult;
  } catch (error) {
    return error;
  }
}

async function getProducts(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.product });

    let sub_categories;

    if (query?.["sub_category"]) {
      sub_categories = query["sub_category"].split(",");
      filterConditions["sub_category"] = { $in: sub_categories };
    }

    if (query?.["is_active"]) {
      filterConditions["is_active"] = query?.["is_active"];
    }
    // if (query?.["category"]) {
    //   filterConditions["category"] = query?.["category"];
    // }
    // if (query?.["brand"]) {
    //   filterConditions["is_active"] = query?.["is_active"];
    // }
    // if (query?.["color"]) {
    //   filterConditions["is_active"] = query?.["is_active"];
    // }
    // if (query?.["brand"]) {
    //   filterConditions["is_active"] = query?.["is_active"];
    // }
    // if (query?.["color"]) {
    //   filterConditions["is_active"] = query?.["is_active"];
    // }

    const fetchResult = await Product.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit)
      .populate("brand")
      .populate("color")
      .populate("category")
      .populate("sub_category")
      .populate("size")
      .populate("unit");

    const total = await Product.countDocuments(filterConditions);
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
async function updateProduct({ id, data }) {
  try {
    const editResult = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteProduct(id) {
  try {
    const deleteResult = await Product.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
};
