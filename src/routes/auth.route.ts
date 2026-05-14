import express, { Request, Response } from "express";
const router = express.Router();

import authController from "../controllers/auth.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  loginSchema,
  registerSchema,
  emailSchema,
  otpVerSchema,
  resetPassSchema,
} from "../schemas/auth.schema";
import userRepository from "../repositories/user.repository";
import { UserRole } from "../types/user.type";
import { userRoles, testUsers } from "../config/constants";
import { createToken, getHashedPassword } from "../utils/tokenisation";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { sendErrorResponse, sendSuccess } from "../utils/responseHandler";
//
router.post(
  "/register-as-bidder",
  validateRequest(registerSchema),
  authController.registerUser(userRoles.admin)
);
//
router.post(
  "/register-as-seller",
  validateRequest(registerSchema),
  authController.registerUser(userRoles.seller)
);
//
router.post(
  "/email-verification",
  validateRequest(otpVerSchema),
  authController.verifyEmail
);
//
router.post(
  "/request-email-verification",
  validateRequest(emailSchema),
  authController.requestEmailVerification
);
//
router.post("/login", authRateLimiter, validateRequest(loginSchema), authController.login);

router.post(
  "/recovery",
  validateRequest(emailSchema),
  authController.requestAccountRecovery
);
//
router.get("/recovery/:token", authController.verifyAccountRecovery);
//
router.post(
  "/reset-password",
  validateRequest(resetPassSchema),
  authController.updatePassword
);
//
// test user generation to get token to check accessControl middlewre
router.get(
  "/get-role-wise-test-account-credentials-and-token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = await Promise.all(
        testUsers.map(async (user) => {
          const hashedPw = await getHashedPassword(user.password);
          return { ...user, password: hashedPw }; // Replace password with hashed password
        })
      );

      for (const user of userData) {
        const existingUser = await userRepository.findByEmail(user.email);
        if (!existingUser) {
          await userRepository.create({
            username: user.email,
            email: user.email,
            name: user.fullName,
            password: user.password,
            role: user.role.toUpperCase() as UserRole,
          });
        }
      }

      const accounts = await Promise.all(
        testUsers.map(async (user) => {
          const dbUser = await userRepository.findByEmail(user.email);
          const token = createToken({
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
        })
      );

      sendSuccess({
        res,
        statusCode: 201,
        message:
          "Test accounts generated for integration testing (SALESMAN/ADMIN/MANAGER). Use the returned token as Bearer token in the Authorization header.",
        data: { accounts },
      });
    } catch (error) {
      sendErrorResponse({ res, error, entity: "TestAccounts" });
    }
  }
);

export default router;
