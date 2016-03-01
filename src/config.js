import dotenv from "dotenv";

dotenv.config();

export const APN_CERTIFICATE = process.env.APN_CERTIFICATE;
export const APN_KEY = process.env.APN_KEY;
export const MONGODB_URL = (
    process.env.MONGODB_URL || "mongodb://localhost:27017/test"
);
export const TRANSMISSION_WAIT_TIME = (
    parseInt(process.env.TRANSMISSION_WAIT_TIME) || 2000
);
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
