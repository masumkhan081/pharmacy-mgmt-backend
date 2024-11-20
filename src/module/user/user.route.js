const { Router } = require("express");
const router = Router();
const userController = require("./user.controller.js");
const validateRequest = require("../../middlewares/validateRequest.js");
const {
  loginSchema,
  registerSchema,
  emailSchema,
  otpVerSchema,
  resetPassSchema,
} = require("./user.validate.js");
const config = require("../../config/index.js");
const {
  verifyToken,
  getHashedPassword,
} = require("../../utils/tokenisation.js");
const User = require("./user.model.js");
const jwt = require("jsonwebtoken");
const { allowedRoles, operableEntities } = require("../../config/constants.js");
//
const Admin = require("../profile/admin-profile/profile.model.js");
const Customer = require("../profile/customer-profile/customer.model.js");
const Rider = require("../profile/rider-profile/rider.model.js");
const Seller = require("../profile/seller-profile/profile.model.js");
const { sendErrorResponse } = require("../../utils/responseHandler.js");
//
router.post(
  "/register-as-seller",
  validateRequest(registerSchema),
  userController.registerUser(allowedRoles.bidder)
);
//
router.post(
  "/register-as-customer",
  validateRequest(registerSchema),
  userController.registerUser(allowedRoles.seller)
);
//
router.post(
  "/email-verification",
  validateRequest(otpVerSchema),
  userController.verifyEmail
);
//
router.post(
  "/request-email-verification",
  validateRequest(emailSchema),
  userController.requestEmailVerfication
);
//
router.post("/login", validateRequest(loginSchema), userController.login);
//
// router.get("/logout", authController.logout);
//
router.post(
  "/recovery",
  validateRequest(emailSchema),
  userController.requestAccountRecovery
);
//
router.get("/recovery/:token", userController.verifyAccountRecovery);
//
router.post(
  "/reset-password",
  validateRequest(resetPassSchema),
  userController.updatePassword
);
//
router.post("/test-auth-token", async (req, res) => {
  // no validation added regarding these field values as it's just for generating test token with different roles
  const { email, role, password, full_name, gender, phone, address } = req.body;
  let user;
  let profile;
  let profileModel;
  try {
    if (role === allowedRoles.admin) {
      profile = await Admin.findOne({ phone });
      profileModel = Admin;
    }
    if (role === allowedRoles.customer) {
      profile = await Customer.findOne({ phone });
      profileModel = Customer;
    }
    if (role === allowedRoles.seller) {
      profile = await Seller.findOne({ phone });
      profileModel = Seller;
    }

    user = await User.findOne({ email, role, password });
    if (profile || user) {
      return res.status(400).json({
        success: false,
        message:
          "data alrady used. note: this api just to generate token with 3 roles to avoid full auth process if intended",
      });
    }

    const hashedPw = await getHashedPassword(password);

    profile = await profileModel.create({
      full_name,
      gender,
      phone,
      address,
    });

    user = await User.create({
      email,
      password: hashedPw,
      role,
      profile_id: profile.id,
      is_verified: true,
    });

    res.status(200).json({
      success: true,
      token: jwt.sign(
        { user_id: user.id, role: user.role, email },
        config.tkn_secret,
        config.jwt_options
      ),
      message: "set it in postman environment var",
    });
  } catch (error) {
    if (profile) {
      await profileModel.findByIdAndDelete(profile.id);
    }
    if (user) {
      await User.findByIdAndDelete(user.id);
    }
    console.log("route: test-token: " + error.message);
    return sendErrorResponse({ res, error, what: operableEntities.user });
    // res.status(500).json({ success: false, message: "Server error" });
  }
});
//
/*
router.get("/cookie-check", async (req, res) => {
    try {
      const token = req.cookies[config.tkn_header_key];
      console.log(token);
  
      const verified = verifyToken({ token, secret: config.tkn_secret });
  
      const user = await User.findById(verified?.user_id);
      const { role, email, phone, full_name } = user;
  
      if (user.isVerified) {
        res.send({
          status: 200,
          success: true,
          message: "good ",
          data: {
            role,
            email,
            phone,
            full_name,
          },
        });
      } else {
        //  needed time to make it more articulated ...
        res.send({
          status: 400,
          success: false,
          message: "not valid",
        });
      }
    } catch (error) {
      res.send({
        status: 400,
        success: false,
        message: "not valid",
      });
    }
  });
  */

module.exports = router;
