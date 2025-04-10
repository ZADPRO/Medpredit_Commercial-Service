import express from "express";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

import upload from "../../Helper/MulterConfig";

const {
  uploadMedicalRecords,
  uploadMedPdfDocs,
} = require("../../Controller/Documents/DocumentController");

const DocumentRoutes = express.Router();

// Medical Records Upload - PDF file also included (Multiple PDF Files in array format)
DocumentRoutes.post(
  "/pdfMedicalRecords/uploadPdf",
  upload.array("files", 10),
  uploadMedPdfDocs
);

DocumentRoutes.post("/uploadMedicalRecords", verifyToken, uploadMedicalRecords);

export default DocumentRoutes;
