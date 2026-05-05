"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const attendance_controller_1 = require("../controllers/attendance.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const attendance_schema_1 = require("../schemas/attendance.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", attendance_controller_1.getAttendances);
router.get("/:id", validateId_1.validateObjectId, attendance_controller_1.getSingleAttendance);
router.post("/", (0, validateRequest_1.default)(attendance_schema_1.attendanceSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), attendance_controller_1.createAttendance);
router.patch("/:id", validateId_1.validateObjectId, (0, validateRequest_1.default)(attendance_schema_1.attendanceSchema), (0, aceessControl_1.default)([constants_1.userRoles.admin]), attendance_controller_1.updateAttendance);
router.delete("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), attendance_controller_1.deleteAttendance);
exports.default = router;
