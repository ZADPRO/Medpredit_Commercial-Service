// DocumentQuery.js
const DB = require("../../Helper/DBConncetion");

const insertMedicalRecord = async ({
  patientId,
  typeOfReportName,
  dateOfReportTaken,
  doctorsName,
  reportDescription,
  pdfData,
  createdAt,
}) => {
  try {
    const sql = `
      INSERT INTO medical_records 
      (patient_id, report_type, report_date, doctor_name, description, pdf_base64, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      patientId,
      typeOfReportName,
      dateOfReportTaken,
      doctorsName,
      reportDescription,
      pdfData,
      createdAt,
    ];

    await DB.query(sql, values);
    return { success: true };
  } catch (error) {
    console.error("Error inserting medical record:", error);
    throw error;
  }
};

module.exports = {
  insertMedicalRecord,
};
