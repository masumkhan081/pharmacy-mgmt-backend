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
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const constants_1 = require("../config/constants");
const tokenisation_1 = require("../utils/tokenisation");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const responseHandler_1 = require("../utils/responseHandler");
//
router.post("/register-as-bidder", (0, validateRequest_1.default)(auth_schema_1.registerSchema), auth_controller_1.default.registerUser(constants_1.userRoles.admin));
//
router.post("/register-as-seller", (0, validateRequest_1.default)(auth_schema_1.registerSchema), auth_controller_1.default.registerUser(constants_1.userRoles.seller));
//
router.post("/email-verification", (0, validateRequest_1.default)(auth_schema_1.otpVerSchema), auth_controller_1.default.verifyEmail);
//
router.post("/request-email-verification", (0, validateRequest_1.default)(auth_schema_1.emailSchema), auth_controller_1.default.requestEmailVerification);
//
router.post("/login", rateLimiter_1.authRateLimiter, (0, validateRequest_1.default)(auth_schema_1.loginSchema), auth_controller_1.default.login);
router.post("/recovery", (0, validateRequest_1.default)(auth_schema_1.emailSchema), auth_controller_1.default.requestAccountRecovery);
//
router.get("/recovery/:token", auth_controller_1.default.verifyAccountRecovery);
//
router.post("/reset-password", (0, validateRequest_1.default)(auth_schema_1.resetPassSchema), auth_controller_1.default.updatePassword);
//
// test user generation to get token to check accessControl middlewre
router.get("/get-role-wise-test-account-credentials-and-token", async (req, res) => {
    try {
        const userData = await Promise.all(constants_1.testUsers.map(async (user) => {
            const hashedPw = await (0, tokenisation_1.getHashedPassword)(user.password);
            return { ...user, password: hashedPw }; // Replace password with hashed password
        }));
        for (const user of userData) {
            const existingUser = await user_repository_1.default.findByEmail(user.email);
            if (!existingUser) {
                await user_repository_1.default.create({
                    username: user.email,
                    email: user.email,
                    name: user.fullName,
                    password: user.password,
                    role: user.role.toUpperCase(),
                });
            }
        }
        const accounts = await Promise.all(constants_1.testUsers.map(async (user) => {
            const dbUser = await user_repository_1.default.findByEmail(user.email);
            const token = (0, tokenisation_1.createToken)({
                payload: {
                    userId: dbUser?.id,
                    role: user.role.toUpperCase(),
                    email: user.email,
                },
                expireTime: "750h",
            });
            return {
                userId: dbUser?.id,
                email: user.email,
                password: user.password,
                fullName: user.fullName,
                role: user.role.toUpperCase(),
                phone: user.phone,
                address: user.address,
                token,
            };
        }));
        (0, responseHandler_1.sendSuccess)({
            res,
            statusCode: 201,
            message: "Test accounts generated for integration testing (SALESMAN/ADMIN/MANAGER). Use the returned token as Bearer token in the Authorization header.",
            data: { accounts },
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "TestAccounts" });
    }
});
exports.default = router;
