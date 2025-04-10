import express from "express";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

const {
  checkPatientMapController,
  addPatientMapController,
  getCurrentReportDataController,
  createReportController,
  getPastReportDataController,
  getReportPDFController,
  getHomeScreenController,
  getHomeScreenAssistantController,
  getTreatmentDetailsController,
  deleteTreatmentDetailController,
} = require("../../Controller/Doctor/DoctorController");

const DoctorRoutes = express.Router();

DoctorRoutes.post("/addEmployee", verifyToken);

DoctorRoutes.post("/checkPatientMap", verifyToken, checkPatientMapController);

DoctorRoutes.post("/addPatientMap", verifyToken, addPatientMapController);

DoctorRoutes.post(
  "/getCurrentReportData",
  verifyToken,
  getCurrentReportDataController
);

DoctorRoutes.post("/createReport", verifyToken, createReportController);

DoctorRoutes.post(
  "/getPastReportData",
  verifyToken,
  getPastReportDataController
);

DoctorRoutes.post("/getReportPDF", verifyToken, getReportPDFController);

DoctorRoutes.post("/getHomeScreenDoctor", verifyToken, getHomeScreenController);

DoctorRoutes.post(
  "/getHomeScreenDoctorAssistant",
  verifyToken,
  getHomeScreenAssistantController
);

DoctorRoutes.post(
  "/getTreatmentDetails",
  verifyToken,
  getTreatmentDetailsController
);

DoctorRoutes.post(
  "/deleteTreatmentDetail",
  verifyToken,
  deleteTreatmentDetailController
);

export default DoctorRoutes;
