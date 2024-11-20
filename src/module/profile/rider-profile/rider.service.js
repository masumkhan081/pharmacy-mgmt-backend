/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const Rider = require("./rider.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
const { removeFile } = require("../../../utils/fileHandle"); 

//

async function getSingleRider(updatableId) {
  try {
    const getResult = await Rider.findById(updatableId);
    return getResult;
  } catch (error) {
    return error;
  }
}

async function createRider(data) {
  try {
    const addResult = await Rider.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function getRiders(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, what: operableEntities.rider });

    const fetchResult = await Rider.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Rider.countDocuments(filterConditions);
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
async function updateRider({ id, data }) {
  try {
    const editResult = await Rider.findByIdAndUpdate(id, data, {
      new: true,
    });
    return editResult;
  } catch (error) {
    return error;
  }
}
//
async function deleteRider(id) {
  try {
    const deleteResult = await Rider.findByIdAndDelete(id);
    console.log("deleteResult:  " + JSON.stringify(deleteResult));
    removeFile({ fileUrl: deleteResult?.rider_profile });
    return deleteResult;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createRider,
  updateRider,
  deleteRider,
  getRiders,
  getSingleRider
};
