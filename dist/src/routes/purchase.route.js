"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const purchase_controller_1 = require("../controllers/purchase.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const purchase_schema_1 = require("../schemas/purchase.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", purchase_controller_1.getPurchases);
router.get("/:id", validateId_1.validateObjectId, purchase_controller_1.getSinglePurchase);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(purchase_schema_1.purchaseSchema), purchase_controller_1.createPurchase);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, purchase_controller_1.updatePurchase);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, purchase_controller_1.deletePurchase);
//
exports.default = router;
