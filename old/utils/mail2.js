import  nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import config from "../config/index"

//  send otp to user email for email verification
const sendUserInvitation = ({ user, res, successMessage }) => {
  //
  const mailOptions = getMailOptions({
    to: user.email,
    subject: () => setSubject("invitation"),
    html: () => getInvitationMessage(user),
  });
  //
  const transporter = getTransporter();

  transporter
    .sendMail(mailOptions)
    .then((result) => {
      result.accepted.includes(user.email)
        ? res.status(201).send({
            message: successMessage,
            token: getOtpToken({ otp: generatedLink, email: user.email }),
          })
        : res.status(400).send({ message: "Error sendign otp to the mail" });
    })
    .catch((err) => {
      // console.log(err);
      res.send(err.message);
    });
};

const getInvitationMessage = (user) =>
  `<h4 style="color:blue;text-align:center;">Please follow the link to create your user account <br><br>${jwt.sign(
    {
      id: user.id,
      email: user.email,
      expireAt: new Date().getTime() + 5 * 60000,
      role: "salesman",
    },
    config.tokenSecret
  )}`;

function sendResetMail(user) {
  return `<h4 style="color:blue;text-align:center;">Please click the link to reset your password: </h4><br><br>${
    process.env.BASE_URL
  }/auth/recovery/${jwt.sign(
    {
      id: user.id,
      email: user.email,
      expireAt: new Date().getTime() + 5 * 60000,
    },
    config.tokenSecret
  )}`;
}

// return a relatable email sibject based on purpose of the mail
const setSubject = (action) =>
  action === "recovery"
    ? pharmacyName + ": Recover Your Password"
    : action === "invitation"
    ? pharmacyName + ": System User Invitation"
    : "";

const getMailOptions = ({ to, subject, html }) => {
  return {
    from: config.hostEmail,
    to,
    subject: subject(),
    html: html(),
  };
};

const getTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnAuthorized: true,
    },
  });

//  create and return a encrypted token holding data: otp and expiration time for it
const getOtpToken = ({ otp, email }) =>
  CryptoJS.AES.encrypt(
    JSON.stringify({
      email,
      otp,
      expireAt: new Date().getTime() + 5 * 60000,
    }),
    tokenSecret
  ).toString();

export default {
  sendResetMail,
  sendUserInvitation,
};
