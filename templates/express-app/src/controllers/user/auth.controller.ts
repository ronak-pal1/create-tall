import { Request, Response } from "express";
import asyncHandler from "../../utils/async.handler";
import { UserModel } from "../../models/user.model";
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
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      AUTH_ROLES.USER,
      user._id,
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
        userId: user._id,
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
    // Check if user with the same email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const user = new UserModel({
      name,
      email,
      password: password,
    });

    await user.save();

    // Generate JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      AUTH_ROLES.USER,
      user._id,
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
        userId: user._id,
      });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error occurred while saving the user." });
  }
});
