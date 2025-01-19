"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const salary_controller_1 = require("../controllers/salary.controller"); // controller functions
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const salary_schema_1 = require("../schemas/salary.schema");
const validateId_1 = require("../middlewares/validateId");
const constants_1 = require("../config/constants");
const aceessControl_1 = __importDefault(require("../middlewares/aceessControl"));
router.get("/", salary_controller_1.getSalaries);
router.get("/:id", validateId_1.validateObjectId, salary_controller_1.getSingleSalary);
router.post("/", (0, aceessControl_1.default)([constants_1.userRoles.admin]), (0, validateRequest_1.default)(salary_schema_1.salarySchema), salary_controller_1.createSalary);
router.patch("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, salary_controller_1.updateSalary);
router.delete("/:id", (0, aceessControl_1.default)([constants_1.userRoles.admin]), validateId_1.validateObjectId, salary_controller_1.deleteSalary);
//
exports.default = router;
