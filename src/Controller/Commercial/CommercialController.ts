import { encrypt } from "../../Helper/Encryption";
import { CurrentTime } from "../../Helper/CurrentTime";
import {
  changeUserIdModel,
  deleteMultipleUserModel,
  getAllValidPackageModel,
  getDashbardModel,
  getFamilyMembersModel,
  getLanguageModel,
  getOneValidPackageModel,
  getParticularUserMobileNumberModel,
  getPaymentTransactionHistoryModel,
  getUserModel,
  getVersionModel,
  handleMultipleUserSigninModel,
  linkFamilyMemberModel,
  postFamilyUserModel,
  purchasePackageModel,
  unlinkFamilyMemberModel,
  UserLoginModel,
  UserSignUpModel,
  userUpdateModel,
  ForgotPasswordModel,
  validatePasswordModel,
  GenerateOTPMail,
  UpdatePasswordModel,
  GetMedicalRecordsByUserModel,
  getDocumentPathById,
  UploadMedicalRecordsModel,
  addMedicalRecordsModel,
  checkSubscriptionModel,
} from "../../Models/Commercial/CommercialModels";
import { AbstractKeyword } from "typescript";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

import path from "path";
import fs from "fs";

const UserLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await UserLoginModel(username, password);

    logger.info(`User Signed In (${username})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Something went Wrong", error);

    logger.error(`User Signed In Error: (${error})`);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const UserSignUpController = async (req, res) => {
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

    // const HigherUser = req.userData.userid;
    // const hospitalId = req.userData ? req.userData.hospitalid : "self";

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
      refGender,
    };

    if (!refUserPassword) {
      console.error("Password is missing in the request body");
      return res.status(400).json({ error: "Password is required" });
    }

    const result = await UserSignUpModel(values);

    logger.info(`New User (${refUserMobileno}) Created by : (self)`);
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `New Patient Create (postNewPatientController) Error: (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

const handleMultipleUserSigninController = async (req, res) => {
  try {
    const { username, password, userId } = req.body;

    const result = await handleMultipleUserSigninModel(
      username,
      password,
      userId
    );

    logger.info(`User Signed In (${username})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`User Signed In Error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const getUserController = async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    const result = await getUserModel(userId);
    console.log("result", result);

    logger.info(`User data (${userId})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`User list In Error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const userUpdateController = async (req: any, res: any) => {
  try {
    const {
      id,
      refUserFname,
      refUserLname,
      refDOB,
      refGender,
      refMaritalStatus,
      refEducation,
      refOccupationLvl,
      refSector,
      activeStatus,
      updatedBy,
      refUserEmail,
      refAddress,
      refDistrict,
      refPincode,
    } = req.body;

    const values = {
      refUserFname,
      refUserLname,
      refDOB,
      refGender,
      refMaritalStatus,
      refEducation,
      refOccupationLvl,
      refSector,
      activeStatus,
      updatedBy,
      refUserEmail,
      refAddress,
      refDistrict,
      refPincode,
    };
    const result = await userUpdateModel(id, values);
    logger.info(`User update (${id})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`user update error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const deleteMultipleUserController = async (req: any, res: any) => {
  try {
    const { id } = req.body;

    console.log(id, req.userData);

    const updatedAt = CurrentTime();
    const updatedBy = req.userData.userid;

    const result = await deleteMultipleUserModel(id, updatedAt, updatedBy);
    logger.info(`All User Deleted (deleteMultipleUserController) (${id})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`user update error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const changeUserIdController = async (req, res) => {
  try {
    const { id, headUserId } = req.body;

    const updatedAt = CurrentTime();
    const updatedBy = req.userData.userid;

    const result = await changeUserIdModel(
      id,
      headUserId,
      updatedAt,
      updatedBy
    );

    logger.info(
      `Delete User And Assign new User (changeUserIdController) (${id})`
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`user update error: (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getAllValidPackageController = async (req, res) => {
  try {
    const refUserId = req.userData.userid;
    console.log("req.userData.userid", req.userData.userid);
    console.log("refUserId", refUserId);
    const { refLanCode } = req.body;
    console.log("refLanCode", refLanCode);

    const currentTime = CurrentTime();

    const result = await getAllValidPackageModel(
      currentTime,
      refUserId,
      refLanCode
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Get All Valid Package (getAllValidPackageController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getOneValidPackageController = async (req, res) => {
  try {
    const { packageId } = req.body;

    const refUserId = req.userData.userid;

    const currentTime = CurrentTime();

    const result = await getOneValidPackageModel(
      packageId,
      currentTime,
      refUserId
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Get All Valid Package (getAllValidPackageController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const purchasePackageController = async (req, res) => {
  try {
    const { txnkey, packageId, method } = req.body;

    const createdAt = CurrentTime();
    const createdBy = req.userData.userid;

    const result = await purchasePackageModel(
      createdBy,
      txnkey,
      packageId,
      method,
      createdAt,
      createdBy
    );

    return res.status(200).json(encrypt(result, false));
  } catch (error) {
    logger.error(`Adding Package (purchasePackageController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getPaymentTransactionHistoryController = async (req, res) => {
  try {
    const refUserId = req.userData.userid;

    const result = await getPaymentTransactionHistoryModel(refUserId);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Adding Package (purchasePackageController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getFamilyMembersController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const createdAt = CurrentTime();
    const createdBy = req.userData.userid;

    const result = await getFamilyMembersModel(
      mobileNumber,
      createdAt,
      createdBy
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Get the Family Memebers (getFamilyMembersController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
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
      isSame,
      mobilenumber,
      userpassword,
      realtionType,
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
      isSame,
      mobilenumber,
      userpassword,
      realtionType,
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

const getParticularUserMobileNumberController = async (req, res) => {
  try {
    const refUserId = req.userData.userid;

    const { mobileNumber } = req.body;

    const result = await getParticularUserMobileNumberModel(
      mobileNumber,
      refUserId
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Get the Family Memebers (getParticularUserMobileNumberController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const linkFamilyMemberController = async (req, res) => {
  try {
    const { refUserId, headMobileNumber, relationName, password } = req.body;

    const createdAt = CurrentTime();
    const createdBy = req.userData.userid;

    const result = await linkFamilyMemberModel(
      refUserId,
      headMobileNumber,
      createdAt,
      createdBy,
      relationName,
      password
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Link Family Memebers (linkFamilyMemberController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const unlinkFamilyMemberController = async (req, res) => {
  try {
    const { refRelationId, password, headMobileNumber } = req.body;

    const updatedAt = CurrentTime();
    const updatedBy = req.userData.userid;

    const result = await unlinkFamilyMemberModel(
      refRelationId,
      updatedAt,
      updatedBy,
      password,
      headMobileNumber
    );

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(
      `Get the Family Memebers (getFamilyMembersController): (${error})`
    );
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getDashbardController = async (req, res) => {
  try {
    const createdAt = CurrentTime();
    const refUserId = req.userData.userid;

    const result = await getDashbardModel(refUserId, createdAt);
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Get the Dashboard (getDashbardController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getLanguageController = async (req, res) => {
  try {
    const result = await getLanguageModel();
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Get the Dashboard (getDashbardController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getVersionController = async (req, res) => {
  try {
    const result = await getVersionModel();
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Get the Version (getVersionController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const validatePasswordController = async (req, res) => {
  try {
    const { email, otp, userId } = req.body;

    if (!email || !otp || !userId) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    const result = await validatePasswordModel(email, otp, userId);

    if (!result.status) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Forgot Password Routes: (${error.message})`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const forgotPasswordRoutes = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    const result = await ForgotPasswordModel(email, newPassword);

    if (!result.status) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Forgot Password Routes: (${error.message})`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const otpMap = new Map(); // Temp in-memory store (ideally use Redis for production)

export const getOTPForMail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpMap.set(email, { otp, createdAt: Date.now() });

    const result = await GenerateOTPMail(email, otp); // Send email with OTP
    console.log("result line -------- 558 \n", result);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const NewPasswordEntryController = async (req, res) => {
  const { userId, password, email } = req.body;
  if (!email || !userId || !password) {
    return res.status(400).json({ error: "Wrong Payload" });
  }

  try {
    const result = await UpdatePasswordModel(userId, password, email); // Send email with OTP

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Failed to update password" });
  }
};

export const addMedicalRecordsController = async (req, res) => {
  try {
    const response = await addMedicalRecordsModel(req.body);

    const encryptedResponse = encrypt(
      {
        success: true,
        message: "Medical record added successfully",
        data: response,
      },
      true
    );

    return res.status(200).json(encryptedResponse);
  } catch (error) {
    console.error("addMedicalRecordsController error:", error);

    const encryptedError = encrypt(
      {
        success: false,
        message: "Failed to add medical record",
      },
      true
    );

    return res.status(500).json(encryptedError);
  }
};
// export const addMedicalRecordsController = async (req, res) => {
//   try {
//     const {
//       docName,
//       date,
//       category,
//       subCategory,
//       notes,
//       centerName,
//       userId, // This should be passed from frontend via FormData
//     } = req.body;

//     const filePath = req.file
//       ? path.join("assets", "medicalRecords", path.basename(req.file.path))
//       : null;

//     const record = {
//       userId,
//       filePath,
//       date,
//       category,
//       subCategory,
//       centerName,
//       notes,
//       docName,
//     };

//     const result = await addMedicalRecordsModel(record);

//     res.status(200).json(encrypt(result, true));
//   } catch (error) {
//     console.error("MedicalRecordsController error:", error);
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

const MedicalRecordsController = async (req, res) => {
  try {
    const { fileName } = req.body;
    console.log("req.body", req.body);
    console.log("fileType", fileName);

    const result = await UploadMedicalRecordsModel(fileName);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("MedicalRecordsController error:", error);
    return res.status(500).json({
      status: false,
      message: "MedicalRecordsController upload failed",
    });
  }
};

export const listMedicalRecordsController = async (req, res) => {
  console.log("req", req);
  const { userId } = req.params;
  console.log("userId", userId);

  try {
    const result = await GetMedicalRecordsByUserModel(userId);
    return res.status(200).json({
      status: true,
      records: result,
    });
  } catch (error) {
    console.error("GetMedicalRecordsByUser error:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching medical records",
    });
  }
};

export const downloadMedicalRecord = async (req, res) => {
  try {
    const { refDocId } = req.body;

    if (!refDocId) {
      return res.status(400).json({ message: "refDocId is required" });
    }

    const record = await getDocumentPathById(refDocId);
    console.log("record", record);

    if (!record || !record.refDocPath) {
      return res.status(404).json({ message: "Document not found" });
    }

    const absolutePath = path.resolve(record.refDocPath);

    console.log("absolutePath", absolutePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(record.refDocPath)}"`
    );

    fs.createReadStream(absolutePath).pipe(res);
    console.log("absolutePath", absolutePath);
  } catch (error) {
    console.error("Error downloading record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkSubscriptionController = async (req, res) => {
  const refUserId = req.userData?.userid;

  // Validate refUserId
  if (!refUserId) {
    return res.status(200).json(
      encrypt(
        {
          status: false,
          message: "No user ID provided.",
        },
        true
      )
    );
  }

  try {
    const result = await checkSubscriptionModel(refUserId);
    console.log("result", result);

    // Check if result is empty
    if (!result || result.length === 0) {
      return res.status(200).json(
        encrypt(
          {
            status: false,
            message: "No subscription found.",
          },
          true
        )
      );
    }

    // Return subscription found
    return res.status(200).json(
      encrypt(
        {
          status: true,
          hasSubscription: result,
        },
        true
      )
    );
  } catch (error) {
    console.error("checkSubscriptionController error:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching subscription data.",
    });
  }
};

module.exports = {
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
  forgotPasswordRoutes,
  getOTPForMail,
  validatePasswordController,
  NewPasswordEntryController,
  MedicalRecordsController,
  listMedicalRecordsController,
  downloadMedicalRecord,
  addMedicalRecordsController,
  checkSubscriptionController,
};
