"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mfr_controller_1 = require("../controllers/mfr.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const mfr_schema_1 = require("../schemas/mfr.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
// 
router.get("/", mfr_controller_1.getManufacturers);
router.get("/:id", validateId_1.validateObjectId, mfr_controller_1.getSingleManufacturer);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(mfr_schema_1.manufacturerSchema), mfr_controller_1.createManufacturer);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, (0, validateRequest_1.default)(mfr_schema_1.manufacturerSchema), mfr_controller_1.updateManufacturer);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, mfr_controller_1.deleteManufacturer);
//
exports.default = router;
