import { Request, Response } from "express";
import { minioClient } from "../../Helper/MinioClient/MinioClient";
const logger = require("../../Helper/Logger");

const BUCKET = process.env.MINIO_BUCKET || "zadroit-bucket";

export const uploadFileToMinio = async (req: Request, res: Response) => {
  const file = req.file;
  const userId = req.body.userId || req.query.userId; // You can pass userId from either form-data field or query

  logger.info("Incoming file", file);
  if (!file || !userId) {
    return res.status(400).json({ message: "File and userId are required" });
  }

  try {
    const timestamp = Date.now();
    const fileExt = file.originalname.split(".").pop();
    const uniqueFileName = `${timestamp}.${fileExt}`;

    const objectName = `medpredit_commercial/medical_documents/${userId}/${uniqueFileName}`;

    // Upload file to MinIO
    await minioClient.putObject(BUCKET, objectName, file.buffer);

    const filePath = `http://192.168.1.112:9000/${BUCKET}/${objectName}`;

    logger.info("File uploaded at path:", filePath);

    return res.status(200).json({
      message: "File uploaded successfully!",
      fileUrl: filePath,
    });
  } catch (err) {
    logger.error("Upload failed:", err);
    return res.status(500).json({ message: "Upload failed", error: err });
  }
};
