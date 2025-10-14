import { Document, model, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { AUTH_ROLES } from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import { config } from "../env.config";

export interface Iadmin extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  otp: number;
  refreshToken: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(rememberMe: boolean): string;
}

// Schema for the admin database
const adminSchema: Schema<Iadmin> = new Schema<Iadmin>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: Number,
  },
  refreshToken: {
    type: String,
    trim: true,
  },
} as const);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error: any) {
    next(error);
  }
});

adminSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// schema method to generate a access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: AUTH_ROLES.ADMIN,
    },
    config.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
};

// schema method to generate a refresh token
adminSchema.methods.generateRefreshToken = function (rememberMe: boolean) {
  return jwt.sign(
    {
      _id: this._id,
      role: AUTH_ROLES.ADMIN,
    },
    config.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: rememberMe ? "20d" : "7d",
    }
  );
};

// Model for the admin
export const AdminModel: Model<Iadmin> = model<Iadmin>("admin", adminSchema);
