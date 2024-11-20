const TktTypeService = require("./tktType.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createTktType(req, res) {
  const result = await TktTypeService.createTktType(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.ticket_type,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.ticket_type,
    });
  }
}

async function getTktTypes(req, res) {
  const result = await TktTypeService.getTktTypes(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.ticket_type,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.ticket_type,
    });
  }
}
//
async function updateTktType(req, res) {
  const result = await TktTypeService.updateTktType({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.ticket_type,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.ticket_type,
    });
  }
}
//
async function deleteTktType(req, res) {
  const result = await TktTypeService.deleteTktType(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.ticket_type,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.ticket_type,
    });
  }
}
//
module.exports = {
  createTktType,
  updateTktType,
  deleteTktType,
  getTktTypes,
};
