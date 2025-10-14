import { Request, Response } from "express";
import asyncHandler from "../../utils/async.handler";
import { AdminModel } from "../../models/admin.model";
import { AUTH_ROLES } from "../../middlewares/auth.middleware";
import { generateAccessAndRefreshTokens } from "../../utils/generateAccessRefreshToken";

// Login Controller
export const login = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const rememberMe: boolean = req.body.rememberMe || false;

  // Input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if employee with the given email exists
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Verify the password
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      AUTH_ROLES.ADMIN,
      admin._id,
      rememberMe
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Send cookies only over HTTPS in production
      // sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful.",
        adminId: admin._id,
      });
  } catch (e) {
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Signup Controller
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  // Input validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, Email and Password are required." });
  }

  try {
    // Check if admin with the same email already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists." });
    }

    const admin = new AdminModel({
      name,
      email,
      password: password,
    });

    await admin.save();

    // Generate JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      AUTH_ROLES.ADMIN,
      admin._id,
      false
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Send cookies only over HTTPS in production
      // sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Signup successful.",
        adminId: admin._id,
      });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error occurred while saving the admin." });
  }
});
