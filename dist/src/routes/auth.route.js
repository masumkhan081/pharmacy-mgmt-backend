"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const auth_schema_1 = require("../schemas/auth.schema");
const user_model_1 = __importDefault(require("../models/user.model"));
const constants_1 = require("../config/constants");
const tokenisation_1 = require("../utils/tokenisation");
//
router.post("/register-as-bidder", (0, validateRequest_1.default)(auth_schema_1.registerSchema), auth_controller_1.default.registerUser(constants_1.userRoles.admin));
//
router.post("/register-as-seller", (0, validateRequest_1.default)(auth_schema_1.registerSchema), auth_controller_1.default.registerUser(constants_1.userRoles.seller));
//
router.post("/email-verification", (0, validateRequest_1.default)(auth_schema_1.otpVerSchema), auth_controller_1.default.verifyEmail);
//
router.post("/request-email-verification", (0, validateRequest_1.default)(auth_schema_1.emailSchema), auth_controller_1.default.requestEmailVerification);
//
router.post("/login", (0, validateRequest_1.default)(auth_schema_1.loginSchema), auth_controller_1.default.login);
router.post("/recovery", (0, validateRequest_1.default)(auth_schema_1.emailSchema), auth_controller_1.default.requestAccountRecovery);
//
router.get("/recovery/:token", auth_controller_1.default.verifyAccountRecovery);
//
router.post("/reset-password", (0, validateRequest_1.default)(auth_schema_1.resetPassSchema), auth_controller_1.default.updatePassword);
//
// test user generation to get token to check accessControl middlewre
router.get("/get-role-wise-test-account-credentials-and-token", async (req, res) => {
    try {
        // Step 1: Hash passwords and prepare user data
        const userData = await Promise.all(constants_1.testUsers.map(async (user) => {
            const hashedPw = await (0, tokenisation_1.getHashedPassword)(user.password);
            return { ...user, password: hashedPw }; // Replace password with hashed password
        }));
        for (const user of userData) {
            const existingUser = await user_model_1.default.findOne({ email: user.email });
            if (!existingUser) {
                await user_model_1.default.create(user);
            }
            else {
                console.log(`User with email ${user.email} already exists`);
            }
        }
        // Step 3: Create JWT tokens for each inserted user
        const response = constants_1.testUsers.map((user) => {
            const payload = {
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            };
            // Generate token for each user
            const token = (0, tokenisation_1.createToken)({
                payload,
                expireTime: "750h", // Set expiration time for the token
            });
            return {
                email: user.email,
                password: user.password,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                address: user.address,
                token,
            };
        });
        // Step 4: Send the response with user data and tokens
        res.status(201).json({
            message: "These are test accounts--- (salesman,admin,manager) for the sole purpose of testing." +
                "Set a token in header naming authentication inside postman, and good to go !",
            accounts: response,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating test accounts:", error.message);
            res
                .status(500)
                .json({ message: `Internal server error ${error.message}` });
        }
    }
});
exports.default = router;
