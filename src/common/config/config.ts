import { config } from 'dotenv';
config();

export const appConfig = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
};
