import dotenv from 'dotenv';

if (dotenv.config().error) {
  console.error("Error loading .env file");
  throw new Error("Error loading .env file");
}


// add your environment variables here
export const config = {
  PORT: process.env.PORT || 8000,
  ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
