const nodemailer = require('nodemailer');
const nodemailerSmtpTransport = require('nodemailer-smtp-transport');
const email = require('../config/email');
module.exports = {
  sendEmail: (mailOptions) => {
    return new Promise((resolve,reject) => {
      nodemailer.createTransport(nodemailerSmtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: email.auth
      })).sendMail(mailOptions,function(err,info) {
        if(err) reject(new Error(err));
        else resolve('Email sent: ' + info.response);
      });
    });
  }
}
