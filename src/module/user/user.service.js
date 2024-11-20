const User = require("./user.model");
const bcrypt = require("bcrypt");
const { sendOTPMail, sendResetMail } = require("../../utils/mail");
const config = require("../../config");
const httpStatus = require("http-status");
const { getSearchAndPagination } = require("../../utils/pagination");
const { operableEntities } = require("../../config/constants");
const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../../utils/responseHandler");
const crypto = require("crypto-js");
const { verifyToken, getHashedPassword } = require("../../utils/tokenisation");
const CustomerProfile = require("../profile/customer-profile/customer.model");
//
async function register({ res, data }) {
  let user;
  let profile;
  try {
    const { fullName, phone, gender, address, email, password, role } = data; // Ensure role is included
    profile = await new Profile({ fullName, phone, address, gender }).save();

    user = await new User({
      email,
      password,
      role,
      profile: profile.id,
    }).save();

    sendOTPMail({
      user,
      res,
      successMessage: "An OTP has been sent to your email for verification.",
    });
  } catch (error) {
    if (profile) {
      await Profile.findByIdAndDelete(profile.id);
    }
    if (user) {
      await User.findByIdAndDelete(user.id);
    }
    console.log("err:: " + error.message);
    res.status(500).json({ message: "Error creating bidder profile" });
  }
}

async function verifyEmail({ data, res }) {
  try {
    // Decrypt OTP token and parse the data
    const { expireAt, otp, email } = JSON.parse(
      crypto.AES.decrypt(data.token, config.tokenSecret).toString(
        crypto.enc.Utf8
      )
    );

    console.log("User input: ", data.otp, data.email, data.token);
    console.log("Parsed from token: ", expireAt, otp, email);

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

async function login({ res, email, password }) {
  try {
    const user = await User.findOne({ email });
    let token;
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        if (user.isVerified) {
          token = jwt.sign(
            {
              userId: user.id, // i should remove id from here !
              role: user.role,
              email: user.email,
              expire: 2628000000 + Date.now(),
            },
            config.tokenSecret,
            config.jwtOptions
          );
          //
          user.isActive = true; // if previously deleted own profile
          await user.save();
          //
          res.status(200).json({
            success: true,
            message: "You are successfully logged in",
            token,
          });
        }
        // email and associated password matched but email not-verified yet
        else {
          sendOTPMail({
            user,
            res,
            successMessage:
              "Email not verified yet. We sent an OTP to your email for verification.",
          });
        }
      } else {
        res.status(400).json({ success: false, message: "Wrong Credentials" });
      }
    }
    // no user with that username in system
    else {
      res.status(400).json({ success: false, message: "Wrong Credentials" });
    }
  } catch (error) {
    console.error("Inside service func:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// async function logout(req, res) {
//   res.clearCookie(config.tokenHeaderKey);
//   res.status(200).json("Pulled Out Succesfully");
// }
//
async function verifyAccountRecovery({ res, token }) {
  try {
    const { success, data } = verifyToken({
      token,
      secret: config.tokenSecret,
    });

    if (!success) {
      return res.status(401).json({
        success: false,
        message: "The provided token is invalid or has changed.",
      });
    }

    const { expireAt, email } = data;

    // Check if the token has expired
    if (new Date().getTime() >= expireAt) {
      return res.status(400).json({
        success: false,
        message: "Password reset link expired.",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // If everything is valid, allow password update, would expect the token at update password post req
    return res.status(200).json({
      success: true,
      message: "You can update your password now.",
      token,
    });
  } catch (error) {
    console.error("Error in verifyAccountRecovery:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
}

async function updatePassword({
  token,
  email: userEmail,
  password,
  confirmPassword,
  res,
}) {
  try {
    const { expireAt, email } = verifyToken({
      token,
      secret: config.tokenSecret,
    });
    if (userEmail !== email) {
      return res.status(400).json({
        success: false,
        message: "Token does not match the email provided",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }
    if (new Date().getTime() < expireAt) {
      return res.status(400).json({
        success: false,
        message: "Timeout. Request for new password reset link",
      });
    }

    const hashedPassword = await getHashedPassword(password);

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You may log in.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  verifyAccountRecovery,
  updatePassword,
};
