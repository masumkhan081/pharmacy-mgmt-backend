import authService from "../services/auth.service";
import { verifyToken, getHashedPassword } from "../utils/tokenisation";
import { sendOTPMail, sendResetMail } from "../utils/mail";
import User from "../models/user.model";
import { Request, Response } from "express";
import { TypeController } from "../types/requestResponse";
import {
  sendBadRequest,
  sendConflict,
  sendErrorResponse,
  sendNotFound,
  sendUnauthorized,
} from "../utils/responseHandler";

const registerUser =
  (role: string) =>
    async (req: Request, res: Response): Promise<void> => {
      try {
        const isExist = await User.findOne({ email: req.body.email });
        if (isExist) {
          return sendConflict({ res, message: "Email already registered." });
        }
        req.body.password = await getHashedPassword(req.body.password);
        req.body.role = role;
        await authService.register({ res, data: req.body });
      } catch (error) {
        sendErrorResponse({ res, error, entity: "user" });
      }
    };

const requestEmailVerification: TypeController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return sendNotFound({
        res,
        message: "No user associated with that email",
      });
    }

    if (user.isVerified) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Account already verified",
      });
      return;
    }

    const { success, token } = await sendOTPMail(req.body.email);

    if (!success) {
      return sendBadRequest({ res, message: "Failed to send OTP" });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "An OTP has been sent to your email for verification",
      data: { token },
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.verifyEmail({ res, data: req.body });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    await authService.login({ res, email, password });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

const requestAccountRecovery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return sendBadRequest({
        res,
        message: "No account associated with that email.",
      });
    }

    if (!user.isVerified) {
      return sendBadRequest({
        res,
        message: "Your account is not verified yet.",
      });
    }

    const { success } = await sendResetMail("user.email");

    if (!success) {
      return sendBadRequest({
        res,
        message: "Failed to send reset link. Please try again.",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "A password reset link has been sent to your mail",
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

const verifyAccountRecovery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { success, payload } = verifyToken(token);

    if (!success || !payload) {
      return sendUnauthorized({
        res,
        message: "The provided token is invalid or has changed.",
      });
    }

    const { expireAt, email } = payload;

    if (expireAt && new Date().getTime() >= expireAt) {
      return sendBadRequest({ res, message: "Password reset link expired." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendNotFound({ res, message: "User not found." });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "You can update your password now.",
      data: { token },
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, email, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendNotFound({
        res,
        message: "No user associated with that email",
      });
    }

    if (password !== confirmPassword) {
      return sendBadRequest({
        res,
        message: "Password & confirm password don't match",
      });
    }

    const { success, payload } = verifyToken(token);

    if (!success || !payload) {
      return sendUnauthorized({
        res,
        message: "The provided token is invalid or has changed.",
      });
    }

    const { expireAt, email: emailFromToken } = payload;

    if (email !== emailFromToken) {
      return sendUnauthorized({
        res,
        message: "The provided token is invalid or has changed.",
      });
    }

    if (expireAt && new Date().getTime() >= expireAt) {
      return sendBadRequest({ res, message: "Password reset link expired." });
    }

    const hashedPassword = await getHashedPassword(password);

    const result = await authService.updatePassword({
      email,
      password: hashedPassword,
    });

    if (result instanceof Error) {
      return sendBadRequest({ res, message: "Failed to update password" });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Password updated successfully. You may log in.",
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: "user" });
  }
};

export default {
  registerUser,
  requestEmailVerification,
  verifyEmail,
  login,
  requestAccountRecovery,
  verifyAccountRecovery,
  updatePassword,
};
