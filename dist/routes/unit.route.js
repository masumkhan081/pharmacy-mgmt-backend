"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const unit_controller_1 = require("../controllers/unit.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const unit_schema_1 = require("../schemas/unit.schema");
const validateId_1 = require("../middlewares/validateId");
// import { TypeController } from "../types/requestResponse";
const constants_1 = require("../config/constants");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
router.post("/", (0, validateRequest_1.default)(unit_schema_1.createUnitSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.createUnit);
router.get("/", unit_controller_1.getUnits);
router.get("/:id", validateId_1.validateObjectId, unit_controller_1.getSingleUnit);
router.patch("/:id", validateId_1.validateObjectId, (0, validateRequest_1.default)(unit_schema_1.updateUnitSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.updateUnit);
router.delete("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.deleteUnit);
//
exports.default = router;
