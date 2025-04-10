import {
  addAssistantMapModels,
  ChangeMobileNumberModel,
  changePasswordModel,
  getDoctorMapListModels,
  getUserListModel,
  handleUserSigninModel,
  postActiveStatus,
  signUpDoctorsModels,
  usersigninModel,
  verifyEnteruserDataModel,
} from "../../Models/Authentication/AuthenticationModels";
import { encrypt } from "../../Helper/Encryption";
import { CurrentTime } from "../../Helper/CurrentTime";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

const usersignin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Hello");

    const result = await usersigninModel(username, password);

    logger.info(`User Signed In (${username})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Something went Wrong", error);

    logger.error(`User Signed In Error: (${error})`);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const handleUserSigninController = async (req, res) => {
  try {
    const { username, password, userId } = req.body;

    const result = await handleUserSigninModel(username, password, userId);

    logger.info(`User Signed In (${username})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`User Signed In Error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(200).json({ message: "tokenformateinvalid" });

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(200).json({ message: "timeexpired" });
    req.userData = user;
    next();
  });
};

const verifyEnteruserData = async (req, res) => {
  // console.log(req.userData.userid);

  const userId = req.userData.userid;

  try {
    const { roleType } = req.body;

    const result = await verifyEnteruserDataModel(roleType, userId);

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Something went Wrong");
    logger.error(`VerifyEnterUser Data Error: (${error})`);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { pastPassword, currentPassword, roleId } = req.body;

    const result = await changePasswordModel(
      req.userData.userid,
      pastPassword,
      currentPassword,
      roleId
    );

    console.log(result);

    logger.info(`Password change for refUserId: (${req.userData.userid})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Password change Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong " });
  }
};

const changeMobileNumberController = async (req, res) => {
  try {
    const { newMobileno, password, roleId } = req.body;

    console.log(newMobileno, password, roleId);

    const result = await ChangeMobileNumberModel(
      req.userData.userid,
      newMobileno,
      password,
      roleId
    );

    logger.info(`Mobile Number change for refUserId: (${req.userData.userid})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Mobile Number change (changeMobileNumberController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong " });
  }
};

const getUserListController = async (req, res) => {
  try {
    const { roleId, hospitalId } = req.body;

    const result = await getUserListModel(roleId, hospitalId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`getUserListController Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const signUpDoctorsControllers = async (req, res) => {
  try {
    const {
      refRoleId,
      refUserFname,
      refUserLname,
      refUserEmail,
      refUserPassword,
      refGender,
      refMaritalStatus,
      refDOB,
      refAddress,
      refDistrict,
      refPincode,
      refUserMobileno,
      allopathic,
      education,
      educationSpecialization,
      superSpecialization,
      supSpecialization,
      additionalDegree,
      degreeType,
      degreeSpecialization,
      medicalCouncil,
      mciRegisteredNo,
      typeHealthcare,
      instituteType,
      nameInstitute,
      designation,
      department,
      instituteAddress,
      previousWork,
      hospitalId,
      selectedUsers,
    } = req.body;

    const createdBy = req.userData.userid;
    const createdAt = CurrentTime();

    const hashedPassword = await bcrypt.hash(refUserPassword, 10);

    const values = {
      refRoleId: refRoleId,
      refUserFname: refUserFname,
      refUserLname: refUserLname,
      refUserEmail: refUserEmail,
      refUserPassword: refUserPassword,
      hashedPassword: hashedPassword,
      refGender: refGender,
      refMaritalStatus: refMaritalStatus,
      refDOB: refDOB,
      refAddress: refAddress,
      refDistrict: refDistrict,
      refPincode: refPincode,
      refUserMobileno: refUserMobileno,
      allopathic: allopathic,
      education: education,
      educationSpecialization: educationSpecialization,
      superSpecialization: superSpecialization,
      supSpecialization: supSpecialization,
      additionalDegree: additionalDegree,
      degreeType: degreeType,
      degreeSpecialization: degreeSpecialization,
      medicalCouncil: medicalCouncil,
      mciRegisteredNo: mciRegisteredNo,
      typeHealthcare: typeHealthcare,
      instituteType: instituteType,
      nameInstitute: nameInstitute,
      designation: designation,
      department: department,
      instituteAddress: instituteAddress,
      previousWork: previousWork,
      createdBy: createdBy,
      createdAt: createdAt,
      hospitalId: hospitalId,
      selectedUsers: selectedUsers,
    };

    const result = await signUpDoctorsModels(values);

    logger.info(
      `Doctor Signup Successfully (signUpDoctors) (${refUserMobileno})`
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Doctor Signup (signUpDoctors) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getDoctorMapListControllers = async (req, res) => {
  try {
    const { hospitalId, assistantId } = req.body;

    const result = await getDoctorMapListModels(hospitalId, assistantId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Doctor MapList (getDoctorMapList) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const addAssistantMapController = async (req, res) => {
  try {
    const createdAt = CurrentTime();
    const createdBy = req.userData.userid;

    const { doctorId, assistantId } = req.body;

    const result = await addAssistantMapModels(
      doctorId,
      assistantId,
      createdAt,
      createdBy
    );

    logger.info(
      `Assiatnt ID: {${assistantId}} Mapped for DoctorID: (${doctorId})`
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Assistant Mapping (addAssistantMap) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const postActiveStatusController = async (req, res) => {
  try {
    const updatedAt = CurrentTime();
    const updatedBy = req.userData.userid;

    const { doctorId, value } = req.body;

    const result = await postActiveStatus(
      doctorId,
      value,
      updatedAt,
      updatedBy
    );

    logger.info(`Docotr ID: ${doctorId} Status Changed as (${value})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Active Status (postActiveStatusController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

module.exports = {
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
  changeMobileNumberController,
};
