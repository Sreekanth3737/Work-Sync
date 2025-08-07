import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Temporarily comment out Arcjet for testing
    // const decision = await aj.protect(req, { email });
    // console.log("Arcjet decision", decision.isDenied());

    // if (decision.isDenied()) {
    //   res.writeHead(403, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "Invalid email address" }));
    // }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    });
    // TODO: Send verification email

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const htmlContent = `<p>Hi ${name},</p>
             <p>Thank you for registering. Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`;
    const subject = "Email Verification for Project Management App";
    const isEmailSent = await sendEmail(email, subject, htmlContent);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email, please try again later.",
      });
    }

    res.status(201).json({
      message:
        "Verification email sent successfully, please verify your email to complete the registration.",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Temporarily comment out Arcjet for testing
    // const decision = await aj.protect(req, { email });
    // console.log("Arcjet decision", decision.isDenied());

    // if (decision.isDenied()) {
    //   res.writeHead(403, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "Invalid email address" }));
    // }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Temporarily bypass email verification for testing
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    // Comment out email verification check for testing
    // if (!user.isEmailVerified) {
    //   const existingVerification = await Verification.findOne({
    //     userId: user._id,
    //     purpose: "email-verification",
    //   });
    //   if (existingVerification && existingVerification.expiresAt > new Date()) {
    //     return res.status(400).json({
    //       message: "Email not verified, please verify your email to login.",
    //     });
    //   } else {
    //     await Verification.deleteOne({ _id: existingVerification._id });
    //     const verificationToken = jwt.sign(
    //       { userId: user._id, purpose: "email-verification" },
    //       process.env.JWT_SECRET,
    //       { expiresIn: "1h" }
    //     );
    //     await Verification.create({
    //       userId: user._id,
    //       token: verificationToken,
    //       expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    //     });

    //     const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    //     const htmlContent = `<p>Hi ${user.name},</p>
    //              <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    //              <a href="${verificationLink}">Verify Email</a>`;
    //     const subject = "Email Verification for Project Management App";
    //     const isEmailSent = await sendEmail(email, subject, htmlContent);

    //     if (!isEmailSent) {
    //       return res.status(500).json({
    //         message:
    //           "Failed to send verification email, please try again later.",
    //       });
    //     }

    //     res.status(201).json({
    //       message:
    //         "Verification email sent successfully, please verify your email to complete the registration.",
    //     });
    //   }
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId, purpose } = decoded;

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verificationRecord = await Verification.findOne({
      userId,
      token,
    });

    if (!verificationRecord) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verificationRecord.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    user.isEmailVerified = true;
    await user.save();
    await Verification.findByIdAndDelete(verificationRecord._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found with this email" });
    }
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message:
          "Email not verified, please verify your email to reset password.",
      });
    }
    const existingVerification = await Verification.findOne({
      userId: user._id,
    });
    if (existingVerification && existingVerification.expiresAt > new Date()) {
      return res.status(400).json({
        message:
          "Password reset request already exists, please try again later.",
      });
    }

    if (existingVerification && existingVerification.expiresAt < new Date()) {
      await Verification.findByIdAndDelete(existingVerification._id);
    }
    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const htmlContent = `<p>Hi ${user.name},</p>
             <p>You requested a password reset. Please click the link below to reset your password:</p>
             <a href="${resetPasswordLink}">Reset Password</a>`;
    const subject = "Password Reset Request for Project Management App";
    const isEmailSent = await sendEmail(email, subject, htmlContent);
    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send password reset email, please try again later.",
      });
    }
    res.status(200).json({
      message:
        "Password reset email sent successfully, please check your email to reset your password.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId, purpose } = payload;
    if (purpose !== "password-reset") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verificationRecord = await Verification.findOne({
      userId,
      token,
    });
    if (!verificationRecord) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isTokenExpired = verificationRecord.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(400).json({ message: "Token has expired" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    // Delete the verification record after successful password reset
    await Verification.findByIdAndDelete(verificationRecord._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
