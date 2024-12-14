import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";

interface TokenPayload {
  // Define the structure of your token payload here
  userId?: string;
  role?: string;
  email?: string;
  expireAt?: number;
  // ... other properties
}

export const createToken = ({
  payload,
  expireTime,
}: {
  payload: TokenPayload;
  expireTime: string;
}) => {
  try {
    return jwt.sign(payload, config.tokenSecret, {
      expiresIn: expireTime,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating token:", error.message);
    } else {
      throw new Error("Token creation failed.");
    }
  }
};

export const verifyToken = (
  token: string
): { success: boolean; payload: TokenPayload | null } => {
  try {
    const payload = jwt.verify(token, config.tokenSecret) as TokenPayload;
    return { success: true, payload };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying token:", error.message);
    }
    return { success: false, payload: null };
  }
};

export async function getHashedPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error generating hash from password:", error);
    throw new Error("Failed to hash password");
  }
}
