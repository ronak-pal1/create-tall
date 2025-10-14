import {Schema} from "mongoose";
import AppError from "./appError";
import { AUTH_ROLES } from "../middlewares/auth.middleware";
import { AdminModel } from "../models/admin.model";
import { UserModel } from "../models/user.model";

export const generateAccessAndRefreshTokens = async (
  requiredRole: AUTH_ROLES,
  instanceId: Schema.Types.ObjectId,
  rememberMe: boolean
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const instance =
      requiredRole == AUTH_ROLES.ADMIN
        ? await AdminModel.findById(instanceId)
        : await UserModel.findById(instanceId);

    if (!instance) {
      throw new AppError(`${requiredRole} not found`, 404);
    }

    const accessToken = instance.generateAccessToken();
    const refreshToken = instance.generateRefreshToken(rememberMe);

    instance.refreshToken = refreshToken;
    await instance.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(
      "Something went wrong while generating refresh and access token",
      500
    );
  }
};