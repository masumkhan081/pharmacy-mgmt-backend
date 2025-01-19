"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const staff_controller_1 = require("../controllers/staff.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const staff_schema_1 = require("../schemas/staff.schema");
const constants_1 = require("../config/constants");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const validateId_1 = require("../middlewares/validateId");
router.get("/", staff_controller_1.getStaffs);
router.get("/:id", validateId_1.validateObjectId, staff_controller_1.getSingleStaff);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(staff_schema_1.staffSchema), staff_controller_1.createStaff);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, staff_controller_1.updateStaff);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, staff_controller_1.deleteStaff);
//
exports.default = router;
