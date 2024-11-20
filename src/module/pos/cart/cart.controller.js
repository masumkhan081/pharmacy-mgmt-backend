const cartService = require("./cart.service");
const httpStatus = require("http-status");
//
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const Cart = require("./cart.model");
const User = require("../../user/user.model");
const Customer = require("../../profile/customer-profile/customer.model");
const Product = require("../../product/product/product.model");
//

async function createOrderFromCart(req, res) {
  try {
    const result = await cartService.createOrderFromCart(req.body);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.order });
    } else {
      sendCreateResponse({ res, data: result, what: operableEntities.order });
    }
  } catch (error) {
    res.status(400).send({ message: "Error creating order from cart" });
  }
}

async function manageCart(req, res) {
  try {
    const existingCustomer = await User.findById(req.user_id);

    if (!existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer doesn't exist",
      });
    }

    const products = req.body.products;

    const checks = products.map(async (product) => {
      const { product: productId, size, color, qty } = product;

      // Check if the product exists with the given size and color
      const existingProduct = await Product.findOne({
        _id: productId,
        size,
        color,
      });

      // Check if the product exists and if it has enough stock
      if (existingProduct) {
        // Validate current stock and minimum order quantity
        const hasEnoughStock = existingProduct.current_stock_quantity >= qty;
        const meetsMinimumOrder = existingProduct.minimum_order_quantity <= qty;

        return hasEnoughStock && meetsMinimumOrder; // Return true if it passes both checks
      }

      return false; // Product does not exist
    });

    // Wait for all checks to complete
    const results = await Promise.all(checks);

    // Check if all products exist and meet quantity requirements
    const allValid = results.every((valid) => valid);

    // if (!allValid) {
    //   return res.status(400).json({
    //     message:
    //       "One or more products do not meet stock or order quantity requirements.",
    //   });
    // }

    const existingCart = await Cart.findOne({ customer: existingCustomer.id });
    console.log(JSON.stringify(existingCart));
    //
    

    //
    // create new cart
    if (!existingCart) {
      const result = await cartService.createCart(req.body);
      if (result instanceof Error) {
        return sendErrorResponse({
          res,
          error: result,
          what: operableEntities.cart,
        });
      }
      return sendCreateResponse({
        res,
        data: result,
        what: operableEntities.cart,
      });
    }

    const updateResult = await cartService.updateCart({
      id: existingCart.id,
      data: req.body,
    });

    if (updateResult instanceof Error) {
      return sendErrorResponse({
        res,
        error: updateResult,
        what: operableEntities.cart,
      });
    }
    return sendUpdateResponse({
      res,
      data: updateResult,
      what: operableEntities.cart,
    });
  } catch (error) {
    console.log("controller:  manageCart : " + error.message);
    res.status(400).send({ message: "Error processing order request" });
  }
}

async function getCarts(req, res) {
  try {
    const result = await cartService.getCarts(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.cart });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.cart });
    }
  } catch (error) {
    res.status(400).send({ message: "Error fetching orders" });
  }
}
//
// async function updateCart(req, res) {
//   const result = await cartService.updateCart({
//     id: req.params.id,
//     data: req.body,
//   });

//   if (result instanceof Error) {
//     sendErrorResponse({ res, error: result, what: operableEntities.cart });
//   } else {
//     sendUpdateResponse({ res, data: result, what: operableEntities.cart });
//   }
// }
//
async function deleteCart(req, res) {
  const result = await cartService.deleteCart(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.cart });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.cart });
  }
}
//
module.exports = {
  createOrderFromCart,
  manageCart,
  // updateCart,
  deleteCart,
  getCarts,
};
