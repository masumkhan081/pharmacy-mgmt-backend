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
import config from "../config/index.js";
import { getHashedPassword } from "../utils/tokenisation";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { userRoles, entities } from "../config/constants";
import Profile from "../models/user.model";
import { sendErrorResponse } from "../utils/responseHandler";
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
router.post(
  "/test-auth-token",
  async (req: Request, res: Response): Promise<void> => {
    const {
      email,
      role,
      password,
      confirmPassword,
      fullName,
      gender,
      phone,
      address,
    } = req.body;
    let user;
    let profile;

    try {
      if (!["ADMIN", "SELLER", "BIDDER"].includes(role)) {
        res.status(400).json({
          success: false,
          message: "Invalid role. Only 'ADMIN', 'SELLER', 'BIDDER' allowed",
        });
      }
      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: "password & confirm password doesn't match",
        });
      }
      if (!email || !phone || !fullName) {
        res.status(400).json({
          success: false,
          message: "Email, phone, and full name are required",
        });
      }

      profile = await Profile.findOne({ phone });
      user = await User.findOne({ email });

      if (!profile) {
        profile = await Profile.create({
          fullName,
          gender,
          phone,
          address,
        });
      }

      const hashedPw = await getHashedPassword(password);
      if (!user) {
        user = await User.create({
          email,
          password: hashedPw,
          role,
          profile: profile.id,
          isVerified: true, // test purpose
        });
      }

      res.status(200).json({
        success: true,
        token: jwt.sign(
          { userId: user.id, role: user.role, email },
          config.tokenSecret,
          config.jwtOptions
        ),
        message: "set it in postman environment var",
      });
    } catch (error) {
      if (profile) {
        await Profile.findByIdAndDelete(profile.id);
      }
      if (user) {
        await User.findByIdAndDelete(user.id);
      }
      return sendErrorResponse({ res, error, entity: entities.drug });
    }
  }
);

module.exports = router;
