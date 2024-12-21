import express, { Request, Response } from "express";
const router = express.Router();

import authController from "../controllers/auth.controller";
import validateRequest from "../middlewares/validateRequest.js";
import {
  loginSchema,
  registerSchema,
  emailSchema,
  otpVerSchema,
  resetPassSchema,
} from "../schemas/auth.schema";
import User from "../models/user.model";
import { userRoles, testUsers } from "../config/constants";
import { createToken, getHashedPassword } from "../utils/tokenisation";
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
router.post("/login", validateRequest(loginSchema), authController.login);

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
//
// Route handler for creating users, hashing passwords, and generating JWT tokens
router.post(
  "/get-role-wise-test-account-credentials-and-token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Step 1: Hash passwords and prepare user data
      const userData = await Promise.all(
        testUsers.map(async (user) => {
          const hashedPw = await getHashedPassword(user.password);
          return { ...user, password: hashedPw }; // Replace password with hashed password
        })
      );

      // Step 2: Insert users into the database
      const insertedUsers = await User.insertMany(userData);

      // Step 3: Create JWT tokens for each inserted user
      const response = insertedUsers.map((user) => {
        const payload = {
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        };

        // Generate token for each user
        const token = createToken({
          payload,
          expireTime: "750h", // Set expiration time for the token
        });

        return {
          user: {
            email: user.email,
            password: user.password,
            fullName: user.fullName,
            role: user.role,
            phone: user.phone,
            address: user.address,
          },
          token,
        };
      });

      // Step 4: Send the response with user data and tokens
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating test accounts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
