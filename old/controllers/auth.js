import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import dotenv from "dotenv";
dotenv.config();
import config from "../config/index.js"
// import mailSender from "../utils/mail";

//

function logOut(req, res) {
  res.clearCookie(tokenHeaderKey);
  res.send("cleared. user logged out");
}

async function checkUserAddition({ token, res }) {
  const data = jwt.verify(token, tokenSecret);
  if (data) {
    const { staffId, expireAt, email, role } = data;
    if (new Date().getTime() > expireAt) {
      res.status(400).send({ message: "Reset link expired" });
    } else {
      (await Staff.findById(staffId))
        ? res.status(200).send({ message: "ok ", data: { id, email, role } })
        : res.status(400).send({ message: "Invalid reset link" });
    }
  } else {
    res.status(400).send({ message: "Error processing link" });
  }
}

async function saveUser({ fullName, email, password, phone, res }) {
  // already registered or not
  const existence = await User.findOne({ email: email }).exec();

  if (existence) {
    res.status(409).send("Email is already in use");
  } else {
    const user = new User({ fullName, email, password, phone });
    const saved = await user.save();
    if (saved) {
      // res.status(201).send({
      //   user: saved,
      //   message: "An OTP has been sent. Please verify your email",
      // });
      // sendMail({ email: saved.email, res, actType: "verification" });
      sendNewUserMail({ user: saved, res });
    } else {
      res.status(400).send("Error creating account");
    }
  }
}

async function loginUser({ email, password, res }) {
  res.status(400).send("Wrong Credentials");
  // already registered or not
  const existence = await User.findOne({ email, password });

  if (existence) {
    // email and associated password matched
    if (existence.isVerified) {
      console.log(tokenHeaderKey, "  <<<<    ", existence.id, tokenSecret);
      res
        .status(200)
        .cookie(tokenHeaderKey, jwt.sign(existence.id, tokenSecret), {
          expires: new Date(Date.now() + 36000),
          overwrite: true,
          httpOnly: true,
        })
        .send({
          email,
          message: "You are logged in",
        });
    }
    // email found but no match for password
    else {
      res.status(401).send("Account Not Verified Yet");
    }
  }
  // no user with that email in system
  else {
    res.status(400).send("Wrong Credentials");
  }
}

async function checkPassReset({ token, res }) {
  var bytes = CryptoJS.AES.decrypt(token, tokenSecret);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  console.log(decryptedData); // [{id: 1}, {id: 2}]
  console.log(">>  ", token);
  res.send("Hello");
}

async function updatePassword({ password, res }) {}

export default {
  checkUserAddition,
  saveUser,
  loginUser,
  logOut,
  checkPassReset,
  updatePassword,
};
