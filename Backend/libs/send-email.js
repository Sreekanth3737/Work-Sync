import nodemailer from "nodemailer";
import dotenv from "dotenv";
import e from "cors";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

const fromEmail = process.env.EMAIL_USER || "jssreekanth777@gmail.com";

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: fromEmail, // Sender address
    to, // Recipient address
    subject, // Email subject
    html, // Email content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default transporter;
