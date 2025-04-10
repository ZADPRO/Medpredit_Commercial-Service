import { encrypt } from "../../Helper/Encryption";
const bcrypt = require("bcrypt");
const { CurrentTime } = require("../../Helper/CurrentTime");
const logger = require("../../Helper/Logger");

const uploadMedicalRecords = async (req, res) => {
  try {
    const {
      patientId,
      typeOfReportName,
      dateOfReportTaken,
      doctorsName,
      reportDescription,
      pdfData,
    } = req.body;

    // Manual Validation
    const errors = [];

    if (!patientId) errors.push("patientId is required.");
    if (!typeOfReportName) errors.push("typeOfReportName is required.");
    if (!dateOfReportTaken) errors.push("dateOfReportTaken is required.");
    if (!doctorsName) errors.push("doctorsName is required.");
    if (dateOfReportTaken) {
      errors.push("dateOfReportTaken must be a valid date.");
    }
    if (!reportDescription) errors.push("reportDescription is required.");
    if (!pdfData) errors.push("pdfData (base64 of the file) is required.");
    if (pdfData && !/^data:application\/pdf;base64,/.test(pdfData)) {
      errors.push("pdfData must be a base64 encoded PDF string.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Payload Validation Failed. Check payload !",
        errors,
      });
    }

    return res.status(200).json({
      message: "Upload successful (mock)",
    });
  } catch (error) {
    logger.error("uploadMedicalRecords error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const uploadMedPdfDocs = async (req, res): Promise<void> => {
  console.log("req", req);
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: "No PDF files uploaded." });
      return;
    }

    const uploadedPaths: string[] = [];

    req.files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, file.originalname);

      const filePath = `/assets/MedicalReportPDF/${file.filename}`;
      uploadedPaths.push(filePath);
    });
    console.log("uploadedPaths", uploadedPaths);

    res.status(200).json({
      message: "PDF files uploaded successfully.",
      filePaths: uploadedPaths,
    });
  } catch (error: any) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Server error during upload." });
  }
};

module.exports = {
  uploadMedicalRecords,
  uploadMedPdfDocs,
};
