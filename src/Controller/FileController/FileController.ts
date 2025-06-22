import { Request, Response } from "express";
import { minioClient } from "../../Helper/MinioClient/MinioClient";
const logger = require("../../Helper/Logger");

const BUCKET = process.env.MINIO_BUCKET || "zadroit-bucket";

export const uploadFileToMinio = async (req: Request, res: Response) => {
  const file = req.file;
  console.log("file", file);
  logger.info("File", file);
  if (!file) return res.status(400).send("No file uploaded");

  try {
    // Upload to MinIO
    await minioClient.putObject(BUCKET, file.originalname, file.buffer);

    // Construct the public (or retrievable) file URL
    const filePath = `http://192.168.1.67:9000/${BUCKET}/${file.originalname}`;

    // Log the path
    console.log("File uploaded to:", filePath);
    logger.info("file path", filePath);

    // Return it in response too
    return res.status(200).json({
      message: "File uploaded successfully!",
      fileUrl: filePath,
    });
  } catch (err) {
    console.error(err);
    logger.error("err", err);
    return res.status(500).json({ message: "Upload failed", error: err });
  }
};
