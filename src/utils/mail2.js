const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenSecret = process.env.TOKEN_SECRET;
const pharmacyName = process.env.PHARMACY_NAME;

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
    tokenSecret
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
    tokenSecret
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
    from: process.env.SENDER,
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

module.exports = {
  sendResetMail,
  sendUserInvitation,
};
