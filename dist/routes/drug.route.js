"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const drug_schema_1 = require("../schemas/drug.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
const drug_controller_1 = require("../controllers/drug.controller");
//
router.get("/", drug_controller_1.getDrugs);
router.get("/:id", validateId_1.validateObjectId, drug_controller_1.getSingleDrug);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(drug_schema_1.drugSchema), drug_controller_1.createDrug);
router.patch("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), drug_controller_1.updateDrug);
router.delete("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), drug_controller_1.deleteDrug);
//
exports.default = router;
