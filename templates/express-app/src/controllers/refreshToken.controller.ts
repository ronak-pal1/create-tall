import { CookieOptions, NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/generateAccessRefreshToken";
import { AUTH_ROLES } from "../middlewares/auth.middleware";
import asyncHandler from "../utils/async.handler";
import { AdminModel } from "../models/admin.model";
import { UserModel } from "../models/user.model";
import { config } from "../env.config";

export const handleRefreshAccessToken = (requiredRole: AUTH_ROLES) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const incomingRefreshToken = req.cookies?.refreshToken;

      if (!incomingRefreshToken) {
        return next(new AppError("Unauthorized request", 401));
      }

      try {
        const decodedToken = jwt.verify(
          incomingRefreshToken,
          config.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;

        let InstanceModel: any = UserModel;

        if (decodedToken?.role == AUTH_ROLES.ADMIN) InstanceModel = AdminModel;

        const instance = await InstanceModel.findById(decodedToken?._id);

        if (!instance) {
          return next(new AppError("Invalid refresh token", 401));
        }

        if (incomingRefreshToken !== instance.refreshToken) {
          return next(new AppError("Refresh token is expired or used", 401));
        }

        const options: CookieOptions = {
          httpOnly: true,
          secure: config.ENV === "production",
          // sameSite: "strict",
        };

        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(
            requiredRole,
            instance._id,
            false
          );

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json({ message: "tokens refreshed" });
      } catch (error: any) {
        return next(
          new AppError(error?.message || "Invalid refresh token", 400)
        );
      }
    }
  );
};
