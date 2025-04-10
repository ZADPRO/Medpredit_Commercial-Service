import express from "express";

const {
  usersignin,
  verifyToken,
  verifyEnteruserData,
  changePasswordController,
  signUpDoctorsControllers,
  getUserListController,
  getDoctorMapListControllers,
  addAssistantMapController,
  postActiveStatusController,
  handleUserSigninController,
  changeMobileNumberController
} = require("../../Controller/Authentication/AuthenticationControllers");

const AuthenticationRoutes = express.Router();

AuthenticationRoutes.post("/user/singin", usersignin);

AuthenticationRoutes.post(
  "/verifyEnteruserData",
  verifyToken,
  verifyEnteruserData
);

AuthenticationRoutes.post(
  "/changePassword",
  verifyToken,
  changePasswordController
);

AuthenticationRoutes.post(
  "/changeMobilenumber",
  verifyToken,
  changeMobileNumberController
);


AuthenticationRoutes.post("/getUserList", verifyToken, getUserListController);

AuthenticationRoutes.post(
  "/signUpDoctors",
  verifyToken,
  signUpDoctorsControllers
);

AuthenticationRoutes.post(
  "/doctorsMapList",
  verifyToken,
  getDoctorMapListControllers
);

AuthenticationRoutes.post(
  "/addAssistantMap",
  verifyToken,
  addAssistantMapController
);

AuthenticationRoutes.post(
  "/postActiveStatus",
  verifyToken,
  postActiveStatusController
);

AuthenticationRoutes.post("/handleUserSignin", handleUserSigninController);

export default AuthenticationRoutes;
