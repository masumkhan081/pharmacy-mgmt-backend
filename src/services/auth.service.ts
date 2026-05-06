import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { sendOTPMail } from "../utils/mail";
import config from "../config";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import Profile from "../models/user.model";
import { Response } from "express";
import {
  sendBadRequest,
  sendErrorResponse,
  sendNotFound,
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
  let user;
  let profile;
  try {
    const { fullName, phone, gender, address, email, password, role } = data;
    profile = await new Profile({ fullName, phone, address, gender }).save();

    user = await new User({
      email,
      password,
      role,
      profile: profile.id,
    }).save();

    const { success, token } = await sendOTPMail("user.email");

    if (success) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "An OTP has been sent to your email for verification",
        data: { token },
      });
    } else {
      if (profile) await Profile.findByIdAndDelete(profile.id);
      if (user) await User.findByIdAndDelete(user.id);
      sendBadRequest({ res, message: "Failed to send verification OTP" });
    }
  } catch (error) {
    if (profile) await Profile.findByIdAndDelete(profile.id);
    if (user) await User.findByIdAndDelete(user.id);
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

    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    if (!user) {
      return sendNotFound({
        res,
        message: "No user associated with that email",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Account verified. You may login",
    });
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
    const user = await User.findOne({ email });
    let token: string | undefined;

    if (!user) {
      return sendBadRequest({ res, message: "Wrong Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendBadRequest({ res, message: "Wrong Credentials" });
    }

    if (!user.isVerified) {
      const { success, token: otpToken } = await sendOTPMail("user.email");
      if (!success) {
        return sendBadRequest({
          res,
          message: "Your account is not verified yet",
        });
      }
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Your account is not yet verified. We sent an OTP to your mail.",
        data: { token: otpToken },
      });
      return;
    }

    token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: "user.email",
        expire: 2628000000 + Date.now(),
      },
      config.tokenSecret,
      config.jwtOptions as jwt.SignOptions
    );

    user.isActive = true;
    await user.save();

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "You are successfully logged in",
      data: { token, user: { id: user.id, role: user.role } },
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
}

// Update Password Function
async function updatePassword({ email, password }: UpdatePasswordData) {
  try {
    const result = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true } // Return the updated document
    );
    return result;
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
