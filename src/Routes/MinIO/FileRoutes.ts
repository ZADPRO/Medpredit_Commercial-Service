import express from "express";
import multer from "multer";
import { uploadFileToMinio } from "../../Controller/FileController/FileController";

const FileRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

FileRoutes.post("/upload", upload.single("file"), uploadFileToMinio);

export default FileRoutes;
