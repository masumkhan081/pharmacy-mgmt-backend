const orderService = require("./order.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { isPostBodyValid } = require("./order.validate");

async function changeStatus(req, res, next) {
  try {
    const updatableId = req.params.id;
    const { status } = req.body;
    const existingOrder = await Order.findById(updatableId);

    if (existingOrder) {
      if (
        [
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
          "OUT FOR DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "FAILED",
        ].includes(status)
      ) {
        const editResult = await Order.findByIdAndUpdate(
          updatableId,
          {
            status,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.order,
          data: editResult,
        });
      } else {
        res
          .status(400)
          .send({ message: "Invalid request for change of status" });
      }
    } else {
      res.status(400).send({ message: "Id not found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error updating status" });
  }
}

async function createOrder(req, res) {
  //  validation for order body
  // must have a customer loggedin
  //  get buying and other prices using product_ids so that i can put it in sub-schema
  // a bit of math
  try {
    await orderService.createOrder({ res, orderData: req.body });
  } catch (error) {
    res.status(400).send({ message: "Error processing order request" });
  }
}

async function getOrders(req, res) {
  try {
    const result = await orderService.getOrders(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.order });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.order });
    }
  } catch (error) {
    res.status(400).send({ message: "Error fetching orders" });
  }
}
//
async function updateOrder(req, res) {
  const result = await orderService.updateOrder({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.order });
  } else {
    sendUpdateResponse({ res, data: result, what: operableEntities.order });
  }
}
//
async function deleteOrder(req, res) {
  const result = await orderService.deleteOrder(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.order });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.order });
  }
}
//
module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  changeStatus,
};
