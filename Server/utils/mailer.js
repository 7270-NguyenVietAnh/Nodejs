const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, 
    auth: {
      user: "6aedf3ba992ed4",
      pass: "53c97497772f5b",
    },
  });
module.exports = {
    sendMailForgotPassword: async function(to,URL){
        return await transporter.sendMail({
            to:to,
            subject:"RESET PASSWORDPASSWORD",
            html:`<a href=${URL}>CLICK VAO DAY DE RESET PASSWORD</a>`
        })
    }
}