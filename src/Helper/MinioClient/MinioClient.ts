// src/Helper/MinioClient.ts
import { Client } from "minio";
import dotenv from "dotenv";

dotenv.config();

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "192.168.1.67",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "SKKzNW1oGq2zRCkhlRuv",
  secretKey:
    process.env.MINIO_SECRET_KEY || "blevZGNgaJB5HimkC0X7Sigx7aqbytrecCP9BzP5",
});
