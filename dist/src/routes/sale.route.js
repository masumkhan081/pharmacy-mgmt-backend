"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const sale_controller_1 = require("../controllers/sale.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const sale_schema_1 = require("../schemas/sale.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", sale_controller_1.getSales);
router.get("/:id", validateId_1.validateObjectId, sale_controller_1.getSingleSale);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(sale_schema_1.saleSchema), sale_controller_1.createSale);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, sale_controller_1.updateSale);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, sale_controller_1.deleteSale);
//
exports.default = router;
