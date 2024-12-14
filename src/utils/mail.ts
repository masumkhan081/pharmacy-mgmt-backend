import dotenv from "dotenv";
dotenv.config();
import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import config from "../config";

// Interface for OTP token parameters
interface OtpTokenParams {
  otp: string;
  email?: string;
  phone?: string;
}

// Interface for MailOptionsParams (used in getMailOptions)
interface MailOptionsParams {
  to: string;
  subject: () => string;
  html: () => string;
}

// Function to send OTP email for verification
const sendOTPMail = async (
  email: string
): Promise<{ success: boolean; token?: string; message?: string }> => {
  try {
    const generatedOTP = generateOTP();

    const mailOptions = getMailOptions({
      to: email,
      subject: () => setSubject("verification"),
      html: () => getVerificationMessage(generatedOTP),
    });

    console.log("mailOptions: " + JSON.stringify(mailOptions));

    const transporter = getTransporter();
    const result: SentMessageInfo = await transporter.sendMail(mailOptions);

    const token = getOtpToken({ otp: generatedOTP, email });

    if (result.accepted.includes(email)) {
      return {
        success: true,
        token,
      };
    }

    return {
      success: false,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("err: sendOTPMail: " + error.message);
      return { success: false, message: error.message };
    } else {
      console.log("An unknown error occurred");
      return { success: false, message: "An unknown error occurred" };
    }
  }
};

// Function to send password reset link to user email
const sendResetMail = async (
  email: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const mailOptions = getMailOptions({
      to: email,
      subject: () => setSubject("recovery"),
      html: () => getResetLink(email),
    });

    const transporter = getTransporter();
    const result: SentMessageInfo = await transporter.sendMail(mailOptions);

    if (result.accepted.includes(email)) {
      return { success: true };
    }

    return { success: false };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("err: sendResetMail: " + error.message);
      return { success: false, message: error.message };
    } else {
      console.log("An unknown error occurred");
      return { success: false, message: "An unknown error occurred" };
    }
  }
};

// Function to generate a 4-digit OTP
const generateOTP = (): string => {
  const digits: string = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Function to get the verification message for OTP
const getVerificationMessage = (otp: string): string =>
  `<h4 style="color:blue;text-align:center;">Please copy or type the OTP provided below: <br><br>${otp}`;

// Function to generate a password reset link
function getResetLink(email: string): string {
  return `<h4 style="color:blue;text-align:center;">Please click the link to reset your password: </h4><br><br>${
    config.baseUrl
  }/api/auth/recovery/${jwt.sign(
    {
      email: email,
      expireAt: new Date().getTime() + 5 * 60000, // Link expiration in 5 minutes
    },
    config.tokenSecret
  )}`;
}

// Function to return a relatable email subject based on the purpose
const setSubject = (action: string): string =>
  action === "recovery"
    ? "Auction-platform: Recover Your Password"
    : action === "verification"
    ? "Auction-platform: Verify Your Email"
    : "";

// Function to get the mail options for sending the email
const getMailOptions = ({
  to,
  subject,
  html,
}: MailOptionsParams): SendMailOptions => {
  return {
    from: config.senderMail,
    to,
    subject: subject(),
    html: html(),
  };
};

// Function to create and return a transporter object for sending emails
const getTransporter = () =>
  nodemailer.createTransport({
    host: config.mailHost,
    port: 587,
    secure: false,
    auth: {
      user: config.senderMail,
      pass: config.senderMailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

// Function to create and return an encrypted OTP token with expiration
function getOtpToken({ otp, email, phone }: OtpTokenParams): string {
  // Define the data to be encrypted
  const data: Record<string, unknown> = {
    otp,
    expireAt: new Date().getTime() + 5 * 60000, // expires in 5 minutes
  };

  // Optionally add email and phone if provided
  if (email) {
    data.email = email;
  }
  if (phone) {
    data.phone = phone;
  }

  // Encrypt the data using CryptoJS
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    config.tokenSecret
  ).toString();
}

// Export functions for use in other modules
export { sendResetMail, sendOTPMail, generateOTP, getOtpToken };
