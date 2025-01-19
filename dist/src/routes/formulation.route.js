"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const formulation_controller_1 = require("../controllers/formulation.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const formulation_schema_1 = require("../schemas/formulation.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
router.get("/", formulation_controller_1.getFormulations);
router.get("/:id", validateId_1.validateObjectId, formulation_controller_1.getSingleFormulation);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(formulation_schema_1.formulationSchema), formulation_controller_1.createFormulation);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, (0, validateRequest_1.default)(formulation_schema_1.formulationSchema), formulation_controller_1.updateFormulation);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, formulation_controller_1.deleteFormulation);
//
exports.default = router;
