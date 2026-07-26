import { config } from 'dotenv';
config();

export const appConfig = {
  PORT: process.env.PORT || 5001,
};
