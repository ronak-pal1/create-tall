import dotenv from 'dotenv';

if (dotenv.config().error) {
  console.error("Error loading .env file");
  throw new Error("Error loading .env file");
}

export const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8000,
  ENV: process.env.NODE_ENV || 'development',
};
