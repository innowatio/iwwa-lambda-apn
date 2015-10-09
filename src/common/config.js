import dotenv from "dotenv";

dotenv.load();

export const APN_CERTIFICATE = process.env.APN_CERTIFICATE;
export const APN_KEY = process.env.APN_KEY;
export const MONGODB_URL = process.env.MONGODB_URL;
