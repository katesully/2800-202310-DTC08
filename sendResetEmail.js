var nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');

// const JWT = require("jsonwebtoken");


const usersModel = require('./models/users.js');
const tokenModel = require('./models/token.js');

// const User = require("../models/User.model");
// const Token = require("../models/Token.model");


const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { func } = require('joi');
const bcryptSalt = process.env.BCRYPT_SALT;

const fs = require("fs");
const path = require("path");
const clientURL = process.env.CLIENT_URL;

const sendResetEmail = async (email, payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_KEY
      }
    });

    var mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Here is your password reset link!',
      text: payload
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    return error;
  }
}

async function authorizedResetPassword(req, res, next) {
  const user = await usersModel.findOne({ email });

  if (!user) {
      throw new Error("User does not exist");
  }
  let token = await tokenModel.findOne({ userId: user._id });
  if (token) { 
        await token.deleteOne()
  };

  let resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = await bcrypt.hash(resetToken, Number(bcryptSalt));


  // might have to change to updateOne
  await new tokenModel({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
  }).save();

   // might have to change to update
  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendResetEmail(user.email,"Password Reset Request",{link: link,});
  return link;

}

