import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import asyncHandler from "../utils/async.handler";
import { AUTH_ROLES } from "../middlewares/auth.middleware";
import { AdminModel } from "../models/admin.model";
import { UserModel } from "../models/user.model";
import { config } from "../env.config";

export const handleLogout = (requiredRole: AUTH_ROLES) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (
        (requiredRole == AUTH_ROLES.USER && !req.user) ||
        (requiredRole == AUTH_ROLES.ADMIN && !req.admin)
      ) {
        next(new AppError("Unauthorized", 401));
        return;
      }

      if (requiredRole == AUTH_ROLES.USER) {
        await UserModel.findByIdAndUpdate(
          req.user._id,
          {
            $unset: {
              refreshToken: 1,
            },
          },
          {
            new: true,
          }
        );
      } else if (requiredRole == AUTH_ROLES.ADMIN) {
        await AdminModel.findByIdAndUpdate(
          req.admin._id,
          {
            $unset: {
              refreshToken: 1,
            },
          },
          {
            new: true,
          }
        );
      }

      const options = {
        httpOnly: true,
        secure: config.ENV === "production",
      };

      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "Logout Successfull" });
    }
  );
};
