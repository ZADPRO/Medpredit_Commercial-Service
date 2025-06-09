import { encrypt } from "../../Helper/Encryption";
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

import {
  getPatientDataModels,
  postNewPatientModels,
  getMainCategoryModels,
  getSubMainCategoryModels,
  getCategoryModels,
  getQuestionsModels,
  postAnswersModels,
  postFamilyUserModel,
  getAssistantDoctorModel,
  resetScoreModel,
  postPastReportModel,
  postCurrentReportModels,
  getPastReportModels,
  getUserScoreVerifyModel,
  getProfileModel,
  getQuestionScoreModel,
  getInvestigationDetailsModel,
  deleteInvestigationDetailModel,
  sendReportMailModel,
} from "../../Models/Assistant/AssistantModels";
import { createReportModel } from "../../Models/Doctor/DoctorModel";

const { CurrentTime } = require("../../Helper/CurrentTime");

const getPatientDataController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const result = await getPatientDataModels(mobileNumber);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Patient Get (getPatientData) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const postNewPatientController = async (req, res) => {
  try {
    const {
      refUserFname,
      refUserLname,
      refUserEmail,
      refUserPassword,
      refDOB,
      refMaritalStatus,
      refEducation,
      refProfession,
      refSector,
      refAddress,
      refDistrict,
      refPincode,
      refUserMobileno,
      refGender,
    } = req.body;

    const salt = 10;

    const hashedPassword = await bcrypt.hash(refUserPassword, salt);

    const HigherUser = req.userData ? req.userData.userid : "self";
    const hospitalId = req.userData ? req.userData.hospitalid : "self";

    const createdBy = req.userData ? req.userData.userid : "self";
    const createdAt = CurrentTime();

    const values = {
      refUserFname,
      refUserLname,
      refUserEmail,
      refUserPassword,
      hashedPassword,
      refDOB,
      refMaritalStatus,
      refEducation,
      refProfession,
      refSector,
      refAddress,
      refDistrict,
      refPincode,
      refUserMobileno,
      createdBy,
      createdAt,
      HigherUser,
      hospitalId,
      refGender,
    };

    if (!refUserPassword) {
      console.error("Password is missing in the request body");
      return res.status(400).json({ error: "Password is required" });
    }

    const result = await postNewPatientModels(values);

    logger.info(`New User (${refUserMobileno}) Created by : (${HigherUser})`);
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `New Patient Create (postNewPatientController) Error: (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const postFamilyUserController = async (req, res) => {
  try {
    const {
      refUserId,
      refUserFname,
      refUserLname,
      refUserEmail,
      refDOB,
      refMaritalStatus,
      refEducation,
      refProfession,
      refSector,
      refAddress,
      refDistrict,
      refPincode,
      refUserMobileno,
      refGender,
    } = req.body;

    const doctorId = req.userData.userid;
    const branch = req.userData.branch ? req.userData.branch : "";

    const values = {
      refUserId,
      refUserFname,
      refUserLname,
      refUserEmail,
      refDOB,
      refMaritalStatus,
      refEducation,
      refProfession,
      refSector,
      refAddress,
      refDistrict,
      refPincode,
      refUserMobileno,
      refGender,
      doctorId,
      branch,
    };

    const result = await postFamilyUserModel(values);

    logger.info(
      `New Family User (${refUserMobileno}) Created by : (${refUserId})`
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `New Family Patient Create (postFamilyUserController) Error: (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getMainCategoryController = async (req, res) => {
  try {
    let doctorId = req.userData.userid;

    const { employeeId, patientId, hospitalId, refLanCode } = req.body;

    if (employeeId) {
      doctorId = employeeId;
    }

    const result = await getMainCategoryModels(
      doctorId,
      patientId,
      hospitalId,
      refLanCode
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Main Category (getMainCategoryController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getSubMainCategoryController = async (req, res) => {
  try {
    const { SubCategoryId, patientId } = req.body;

    const doctorId = 0;

    const result = await getSubMainCategoryModels(
      SubCategoryId,
      doctorId,
      patientId
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Sub-Main Category (getSubMainCategoryController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getCategoryController = async (req, res) => {
  try {
    const { SubCategoryId, patientId, employeeId, hospitalId, refLanCode } =
      req.body;
    let doctorId = req.userData.userid;

    if (employeeId) {
      doctorId = employeeId;
    }

    const result = await getCategoryModels(
      SubCategoryId,
      patientId,
      doctorId,
      hospitalId,
      refLanCode
    );
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Category (getCategoryController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const getQuestionsController = async (req, res) => {
  try {
    const { patientId, questionId, refLanCode } = req.body;

    const result = await getQuestionsModels(
      patientId,
      questionId,
      req.userData.userid,
      refLanCode
    );
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Getting Question (getQuestionsController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const postAnswersController = async (req, res) => {
  try {
    const {
      patientId,
      categoryId,
      answers,
      employeeId,
      hospitalId,
      refLanCode,
    } = req.body;

    let doctorId = req.userData.userid;

    const createdBy = req.userData.userid;

    if (employeeId) {
      doctorId = employeeId;
    }

    const result = await postAnswersModels(
      patientId,
      categoryId,
      answers,
      doctorId,
      createdBy,
      hospitalId,
      refLanCode
    );

    console.log("hello");

    // await createReportModel(patientId, doctorId, hospitalId, createdBy);

    logger.info(`User (${patientId}) Answered (${categoryId})`);

    return res.status(200).json(encrypt(result, true));
    // return res.status(200).json(encrypt({status:true}, true));
  } catch (error) {
    logger.error(`POst Answer (postAnswersController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getAssistantDoctorController = async (req, res) => {
  try {
    const { hospitalId } = req.body;

    const result = await getAssistantDoctorModel(
      req.userData.userid,
      hospitalId
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Assistant Doctor Map (getAssistantDoctorController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const resetScoreController = async (req, res) => {
  try {
    const { refPatientId, refQCategoryId, refHospitalId, employeeId } =
      req.body;

    let doctorId = req.userData.userid;

    if (employeeId) {
      doctorId = employeeId;
    }

    const result = await resetScoreModel(
      refPatientId,
      refQCategoryId,
      refHospitalId,
      doctorId
    );

    logger.info(`User (${refPatientId}) score restted for (${refQCategoryId})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`User score Reset (resetScoreController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const postPastReportController = async (req, res) => {
  try {
    const { patientId } = req.body;

    const result = await postPastReportModel(patientId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Past Report (postPastReportController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const postCurrentReportContoller = async (req, res) => {
  try {
    const { doctorId, patientId, patientGender, hospitalId } = req.body;

    let doctorIdVal = req.userData.userid;

    if (doctorId) {
      doctorIdVal = doctorId;
    }

    const result = await postCurrentReportModels(
      doctorIdVal,
      patientId,
      patientGender,
      hospitalId
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Current Report (postCurrentReportContoller) Error: (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const getPastReportController = async (req, res) => {
  try {
    const { scoreId } = req.body;

    const result = await getPastReportModels(scoreId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Past Report (getPastReportController) Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getUserScoreVerifyController = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const result = await getUserScoreVerifyModel(categoryId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Score Verify (getUserScoreVerifyController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getProfileController = async (req, res) => {
  try {
    const { hospitalId, roleId } = req.body;

    console.log(hospitalId, roleId);

    const result = await getProfileModel(
      req.userData.userid,
      hospitalId,
      roleId
    );
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Profile Data (getProfileController) Error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getQuestionScoreController = async (req, res) => {
  try {
    const { patientId, categoryId } = req.body;

    const result = await getQuestionScoreModel(patientId, categoryId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Question Score (getQuestionScoreController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const getInvestigationDetailsController = async (req, res) => {
  try {
    const { patientId, categoryId } = req.body;
    const result = await getInvestigationDetailsModel(patientId, categoryId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Investigation Details (getInvestigationDetailsController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const deleteInvestigationDetailController = async (req, res) => {
  try {
    const { investigationId } = req.body;

    const result = await deleteInvestigationDetailModel(investigationId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Delete Investigation (deleteInvestigationDetailController) Error: (${error})`
    );
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const sendReportMailController = async (req, res) => {
  try {
    const { email, pdfBase64, filename, name } = req.body;

    // Validate request body
    if (!email || !pdfBase64 || !filename || !name) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Send Email
    const result: any = await sendReportMailModel(
      email,
      pdfBase64,
      filename,
      name
    );

    if (result.status) {
      return res.status(200).json(encrypt(result, true));
    } else {
      return res.status(200).json(encrypt(result, true));
    }
  } catch (error) {
    logger.error(`Mail Send (sendReportMailController) Error: (${error})`);
    console.error("❌ Mail Send (sendReportMailController) Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getPatientDataController,
  postNewPatientController,
  getMainCategoryController,
  getSubMainCategoryController,
  getCategoryController,
  getQuestionsController,
  postAnswersController,
  postFamilyUserController,
  getAssistantDoctorController,
  resetScoreController,
  postPastReportController,
  postCurrentReportContoller,
  getPastReportController,
  getUserScoreVerifyController,
  getProfileController,
  getQuestionScoreController,
  getInvestigationDetailsController,
  deleteInvestigationDetailController,
  sendReportMailController,
};
