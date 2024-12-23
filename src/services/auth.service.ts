import User from "../models/user.model";
import bcrypt from "bcrypt";
import { sendOTPMail } from "../utils/mail";
import config from "../config";
// import { getSearchAndPagination } from "../utils/queryHandler";
// import { entities } from "../config/constants";
import jwt from "jsonwebtoken";
// import { sendErrorResponse } from "../../utils/responseHandler";
import crypto from "crypto-js";
// import { verifyToken, getHashedPassword } from "../utils/tokenisation";
import Profile from "../models/user.model";
import { Response } from "express";

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

    const { success, token } = await sendOTPMail(user.email);

    if (success) {
      res.status(200).json({
        success,
        message: "An OTP has been sent to your email for verification",
        token,
      });
    } else {
      if (profile) {
        await Profile.findByIdAndDelete(profile.id);
      }
      if (user) {
        await User.findByIdAndDelete(user.id);
      }
    }
  } catch (error) {
    if (profile) {
      await Profile.findByIdAndDelete(profile.id);
    }
    if (user) {
      await User.findByIdAndDelete(user.id);
    }
    if (error instanceof Error) console.log("err: register: " + error.message);
    res.status(500).json({ message: "Error creating user profile" });
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

    // Check if OTP has expired
    if (new Date().getTime() > expireAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Validate OTP and email
    if (data.otp === otp && data.email === email) {
      const user = await User.findOneAndUpdate({ email }, { isVerified: true });

      if (user) {
        return res.status(200).json({
          success: true,
          message: "Account verified. You may login",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No user associated with that email",
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or email" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        if (user.isVerified) {
          token = jwt.sign(
            {
              userId: user.id,
              role: user.role,
              email: user.email,
              expire: 2628000000 + Date.now(),
            },
            config.tokenSecret,
            config.jwtOptions
          );

          user.isActive = true;
          await user.save();

          res.status(200).json({
            success: true,
            message: "You are successfully logged in",
            token,
          });
        } else {
          const { success, token } = await sendOTPMail(user.email);
          return res.status(success ? 200 : 400).json({
            success,
            message: success
              ? "Your account is not yet verified. We sent an OTP to your mail."
              : "Your account is not verified yet",
            token,
          });
        }
      } else {
        res.status(400).json({ success: false, message: "Wrong Credentials" });
      }
    } else {
      res.status(400).json({ success: false, message: "Wrong Credentials" });
    }
  } catch (error) {
    console.error("Inside service func:", error);
    res.status(500).json({ message: "Internal server error" });
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
