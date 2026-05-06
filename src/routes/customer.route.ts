import express from "express";
const router = express.Router();
import {
  createCustomer,
  getCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customer.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getCustomers);

router.get("/:id", validateObjectId, getSingleCustomer);

router.post(
  "/",
  validateRequest(createCustomerSchema),
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  createCustomer
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateCustomerSchema),
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  updateCustomer
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteCustomer
);

export default router;
