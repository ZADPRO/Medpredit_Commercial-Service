import {
  calculateAge,
  getDateOnly,
  getParticularDateOnly,
} from "../../Helper/CurrentTime";

const DB = require("../../Helper/DBConncetion");

const {} = require("./DocumentQuery");

const { CurrentTime } = require("../../Helper/CurrentTime");

const { insertMedicalRecord } = require("./DocumentQuery");

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

    const errors = [];

    if (!patientId) errors.push("patientId is required.");
    if (!typeOfReportName) errors.push("typeOfReportName is required.");
    if (!dateOfReportTaken) errors.push("dateOfReportTaken is required.");
    if (!doctorsName) errors.push("doctorsName is required.");
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

    const createdAt = new Date().toISOString(); // or use your CurrentTime helper

    await insertMedicalRecord({
      patientId,
      typeOfReportName,
      dateOfReportTaken,
      doctorsName,
      reportDescription,
      pdfData,
      createdAt,
    });

    return res.status(200).json({
      message: "Medical record uploaded successfully.",
    });
  } catch (error) {
    logger.error("uploadMedicalRecords error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
