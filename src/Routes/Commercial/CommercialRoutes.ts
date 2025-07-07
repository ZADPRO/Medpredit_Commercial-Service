import express from "express";

import multer from "multer";
import path from "path";
import fs from "fs";
// import { UserCountController } from "../../Controller/Commercial/CommercialController";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

const {
  UserLoginController,
  UserSignUpController,
  handleMultipleUserSigninController,
  getUserController,
  userUpdateController,
  deleteMultipleUserController,
  changeUserIdController,
  getAllValidPackageController,
  purchasePackageController,
  getOneValidPackageController,
  getPaymentTransactionHistoryController,
  getFamilyMembersController,
  postFamilyUserController,
  getParticularUserMobileNumberController,
  linkFamilyMemberController,
  unlinkFamilyMemberController,
  getDashbardController,
  getLanguageController,
  getVersionController,
  validatePasswordController,
  forgotPasswordRoutes,
  NewPasswordEntryController,
  getOTPForMail,
  downloadMedicalRecord,
  MedicalRecordsController,
  listMedicalRecordsController,
  addMedicalRecordsController,
  checkSubscriptionController,
} = require("../../Controller/Commercial/CommercialController");

const CommercialRoutes = express.Router();

CommercialRoutes.post("/usersignin", UserLoginController);

CommercialRoutes.post("/usersignup", UserSignUpController);

CommercialRoutes.post(
  "/handleMultipleUserSignin",
  handleMultipleUserSigninController
);

CommercialRoutes.post("/getUsers", verifyToken, getUserController);

CommercialRoutes.post("/userupdate", verifyToken, userUpdateController);

CommercialRoutes.post(
  "/deleteMultipleUser",
  verifyToken,
  deleteMultipleUserController
);

CommercialRoutes.post("/changeUserId", verifyToken, changeUserIdController);

CommercialRoutes.post(
  "/getAllValidPackage",
  verifyToken,
  getAllValidPackageController
);

CommercialRoutes.post(
  "/getOneValidPackage",
  verifyToken,
  getOneValidPackageController
);

CommercialRoutes.post(
  "/purchasePackage",
  verifyToken,
  purchasePackageController
);

CommercialRoutes.get(
  "/getPaymentTransactionHistory",
  verifyToken,
  getPaymentTransactionHistoryController
);

CommercialRoutes.post(
  "/getFamilyMembers",
  verifyToken,
  getFamilyMembersController
);

CommercialRoutes.post(
  "/postFamilyMembers",
  verifyToken,
  postFamilyUserController
);

CommercialRoutes.post(
  "/getParticularUserMobileNumber",
  verifyToken,
  getParticularUserMobileNumberController
);

CommercialRoutes.post(
  "/linkFamilyMember",
  verifyToken,
  linkFamilyMemberController
);

CommercialRoutes.post(
  "/unlinkFamilyMember",
  verifyToken,
  unlinkFamilyMemberController
);

CommercialRoutes.get("/getdashboard", verifyToken, getDashbardController);

CommercialRoutes.get("/getLanguage", getLanguageController);

CommercialRoutes.get("/getVersion", getVersionController);

CommercialRoutes.get(
  "/checkSubscription",
  verifyToken,
  checkSubscriptionController
);

CommercialRoutes.post("/generateOTPForPassword", getOTPForMail);

CommercialRoutes.post("/validateOTPForPassword", validatePasswordController);

CommercialRoutes.post("/forgotPassword", forgotPasswordRoutes);

CommercialRoutes.post("/enterNewPassword", NewPasswordEntryController);

// Create the storage location and filename logic
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = "assets/medicalRecords";
//     fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}.pdf`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// CommercialRoutes.post(
//   "/medicalRecordsUpload",
//   upload.single("pdf"),
//   MedicalRecordsController
// );

CommercialRoutes.post("/medicalRecordsUpload", MedicalRecordsController);

CommercialRoutes.post("/addmedicalRecords", addMedicalRecordsController);

CommercialRoutes.get(
  "/medicalRecordsDetails/:userId",
  listMedicalRecordsController
);

CommercialRoutes.post("/medicalRecordsDownload", downloadMedicalRecord);



export default CommercialRoutes;