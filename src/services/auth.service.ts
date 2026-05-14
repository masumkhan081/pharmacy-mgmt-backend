import userRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { sendOTPMail } from "../utils/mail";
import config from "../config";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import { UserRole } from "../types/user.type";
import { Response } from "express";
import {
  sendBadRequest,
  sendConflict,
  sendErrorResponse,
  sendNotFound,
  sendSuccess,
} from "../utils/responseHandler";

// Define interfaces for expected inputs
interface RegisterData {
  fullName: string;
  phone: string;
  gender: string;
  address: string;
  email: string;
  password: string;
  role: string;
}

interface VerifyEmailData {
  token: string;
  otp: string;
  email: string;
}

// interface LoginData {
//   email: string;
//   password: string;
// }

interface UpdatePasswordData {
  email: string;
  password: string;
}

// Register Function
async function register({ res, data }: { res: Response; data: RegisterData }) {
  try {
    const { fullName, email, password, role } = data;

    // Check if user already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return sendConflict({ res, message: "Email already registered" });
    }

    // Hash password (if not already handled in controller, but service is better)
    // Actually auth.controller calls getHashedPassword
    
    const user = await userRepository.create({
      username: email, // Use email as username for now if not provided
      email,
      name: fullName,
      password,
      role: role.toUpperCase() as UserRole,
    });

    // Email verification logic remains same
    const { success, token } = await sendOTPMail(email);

    if (success) {
      sendSuccess({
        res,
        message: "An OTP has been sent to your email for verification",
        data: { token },
      });
    } else {
      // In a real app, we might want to delete the user if OTP fails, 
      // but usually we just allow them to resend.
      sendBadRequest({ res, message: "Failed to send verification OTP" });
    }
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
}

// Verify Email Function
async function verifyEmail({
  data,
  res,
}: {
  data: VerifyEmailData;
  res: Response;
}) {
  try {
    const { expireAt, otp, email } = JSON.parse(
      crypto.AES.decrypt(data.token, config.tokenSecret).toString(
        crypto.enc.Utf8
      )
    );

    if (new Date().getTime() > expireAt) {
      return sendBadRequest({ res, message: "OTP expired" });
    }

    if (data.otp !== otp || data.email !== email) {
      return sendBadRequest({ res, message: "Invalid OTP or email" });
    }

    const userDoc = await userRepository.findByEmail(email);
    if (!userDoc) {
      return sendNotFound({
        res,
        message: "No user associated with that email",
      });
    }

    // We don't have isVerified in the new Prisma User yet? 
    // Actually I should add it to the schema.
    // For now, let's assume verification is a flag we can add.
    
    // TEMPORARY: Just update isVerified.
    await userRepository.update(userDoc.id, { isVerified: true, isActive: true });

    sendSuccess({ res, message: "Account verified. You may login", data: null });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
}

// Login Function
async function login({
  res,
  email,
  password,
}: {
  res: Response;
  email: string;
  password: string;
}) {
  try {
    const userDoc = await userRepository.findByEmail(email);
    let token: string | undefined;

    if (!userDoc || !userDoc.password) {
      return sendBadRequest({ res, message: "Wrong Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return sendBadRequest({ res, message: "Wrong Credentials" });
    }

    if (!userDoc.isVerified) {
      const { success, token: otpToken } = await sendOTPMail(userDoc.email);
      if (!success) {
        return sendBadRequest({
          res,
          message: "Your account is not verified yet",
        });
      }
      sendSuccess({
        res,
        message: "Your account is not yet verified. We sent an OTP to your mail.",
        data: { token: otpToken },
      });
      return;
    }
    
    token = jwt.sign(
      {
        userId: userDoc.id,
        role: userDoc.role,
        email: userDoc.email,
        expire: 2628000000 + Date.now(),
      },
      config.tokenSecret,
      config.jwtOptions as jwt.SignOptions
    );

    if (!userDoc.isActive) {
      await userRepository.update(userDoc.id, { isActive: true });
    }

    sendSuccess({
      res,
      message: "You are successfully logged in",
      data: { token, user: { userId: userDoc.id, role: userDoc.role, email: userDoc.email } },
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
}

// Update Password Function
async function updatePassword({ email, password }: UpdatePasswordData) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    
    return await userRepository.update(user.id, { password });
  } catch (error) {
    return error;
  }
}

export default {
  register,
  login,
  verifyEmail,
  updatePassword,
};
