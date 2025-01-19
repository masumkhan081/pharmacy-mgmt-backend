"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const group_controller_1 = require("../controllers/group.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const group_schema_1 = require("../schemas/group.schema");
const constants_1 = require("../config/constants");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const validateId_1 = require("../middlewares/validateId");
router.get("/", group_controller_1.getGroups);
router.get("/:id", validateId_1.validateObjectId, group_controller_1.getSingleGroup);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(group_schema_1.groupSchema), group_controller_1.createGroup);
router.patch("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(group_schema_1.groupSchema), group_controller_1.updateGroup);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, group_controller_1.deleteGroup);
//
exports.default = router;
