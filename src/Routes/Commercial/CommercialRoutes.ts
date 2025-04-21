import express from "express";

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
  getVersionController
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

CommercialRoutes.get(
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


CommercialRoutes.get(
  "/getdashboard",
  verifyToken,
  getDashbardController
);

CommercialRoutes.get(
  "/getLanguage",
  getLanguageController
)

CommercialRoutes.get(
  "/getVersion",
  getVersionController
)


export default CommercialRoutes;
