"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const unit_controller_1 = require("../controllers/unit.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const attendance_schema_1 = require("../schemas/attendance.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", unit_controller_1.getUnits);
router.get("/:id", unit_controller_1.getSingleUnit);
router.post("/", (0, validateRequest_1.default)(attendance_schema_1.attendanceSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.createUnit);
router.patch("/:id", validateId_1.validateObjectId, (0, validateRequest_1.default)(attendance_schema_1.attendanceSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.updateUnit);
router.delete("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), unit_controller_1.deleteUnit);
//
exports.default = router;
