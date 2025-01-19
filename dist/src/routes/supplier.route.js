"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const supplier_controller_1 = require("../controllers/supplier.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const supplier_schema_1 = require("../schemas/supplier.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", supplier_controller_1.getSuppliers);
router.get("/:id", validateId_1.validateObjectId, supplier_controller_1.getSingleSupplier);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(supplier_schema_1.supplierSchema), supplier_controller_1.createSupplier);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, supplier_controller_1.updateSupplier);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, supplier_controller_1.deleteSupplier);
//
exports.default = router;
