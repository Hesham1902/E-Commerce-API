const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailoptions = {
    from: "E-shop App <pireboy75@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  await transporter.sendMail(mailoptions);
};

module.exports = sendMail;
