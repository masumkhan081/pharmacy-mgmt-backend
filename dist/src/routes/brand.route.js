"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const brand_controller_1 = require("../controllers/brand.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const brand_schema_1 = require("../schemas/brand.schema");
const validateId_1 = require("../middlewares/validateId");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
const constants_1 = require("../config/constants");
//
router.get("/", brand_controller_1.getBrands);
router.get("/:id", validateId_1.validateObjectId, brand_controller_1.getSingleBrand);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(brand_schema_1.brandSchema), brand_controller_1.createBrand);
router.patch("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(brand_schema_1.brandUpdateSchema), brand_controller_1.updateBrand);
router.delete("/:id", validateId_1.validateObjectId, (0, aceessControl_1.default)([constants_1.userRoles.admin]), brand_controller_1.deleteBrand);
//
exports.default = router;
