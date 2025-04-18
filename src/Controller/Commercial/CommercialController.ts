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
  handleMultipleUserSigninModel,
  linkFamilyMemberModel,
  postFamilyUserModel,
  purchasePackageModel,
  unlinkFamilyMemberModel,
  UserLoginModel,
  UserSignUpModel,
  userUpdateModel,
} from "../../Models/Commercial/CommercialModels";
import { AbstractKeyword } from "typescript";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

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

    const currentTime = CurrentTime();

    const result = await getAllValidPackageModel(currentTime, refUserId);

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

    return res.status(200).json(encrypt(result, true));
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

    const result = await getFamilyMembersModel(mobileNumber, createdAt, createdBy);

    return res.status(200).json(encrypt(result, true));

  } catch (error) {
    logger.error(`Get the Family Memebers (getFamilyMembersController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }

}

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
      realtionType
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
      realtionType
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

    const result = await getParticularUserMobileNumberModel(mobileNumber, refUserId);

    return res.status(200).json(encrypt(result, true));

  } catch (error) {
    logger.error(`Get the Family Memebers (getParticularUserMobileNumberController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }

}

const linkFamilyMemberController = async (req, res) => {
  try {
    const { refUserId, headMobileNumber, relationName, password } = req.body;

    const createdAt = CurrentTime();
    const createdBy = req.userData.userid;

    const result = await linkFamilyMemberModel(refUserId, headMobileNumber, createdAt, createdBy, relationName, password);

    return res.status(200).json(encrypt(result, true));

  } catch (error) {
    logger.error(`Link Family Memebers (linkFamilyMemberController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }

}

const unlinkFamilyMemberController = async (req, res) => {
  try {

    const { refRelationId, password, headMobileNumber } = req.body;

    const updatedAt = CurrentTime();
    const updatedBy = req.userData.userid;

    const result = await unlinkFamilyMemberModel(refRelationId, updatedAt, updatedBy, password, headMobileNumber);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Get the Family Memebers (getFamilyMembersController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
}


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
}

const getLanguageController = async (req, res) => {
  try {
    const result = await getLanguageModel();
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`Get the Dashboard (getDashbardController): (${error})`);
    console.error("Something went Wrong", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
}

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
  getLanguageController
};
