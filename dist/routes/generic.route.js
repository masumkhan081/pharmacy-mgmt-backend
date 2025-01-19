"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const generic_controller_1 = require("../controllers/generic.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const generic_schema_1 = require("../schemas/generic.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", generic_controller_1.getGenerics);
router.get("/:id", validateId_1.validateObjectId, generic_controller_1.getSingleGeneric);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(generic_schema_1.genericSchema), generic_controller_1.createGeneric);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, (0, validateRequest_1.default)(generic_schema_1.genericUpdateSchema), generic_controller_1.updateGeneric);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, generic_controller_1.deleteGeneric);
//
exports.default = router;
