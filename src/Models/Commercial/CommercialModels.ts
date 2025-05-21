import { subscribe } from "diagnostics_channel";
import {
  addDaysToDate,
  calculateDaysDifference,
  CurrentTime,
  getDateOnly,
} from "../../Helper/CurrentTime";
import {
  checkMobileNumberQuery,
  getAssessmentNoQuery,
  getPasswordQuery,
  getUserId,
  nextUserId,
  overAllId,
  postnewCommunication,
  postNewUser,
  postnewUserDomain,
} from "../Assistant/AssistantQuery";
import {
  changePasswordQuery,
  getUsersListMobileNo,
  postActiveQuery,
  userParticularSiginQuery,
  usersigninQuery,
} from "../Authentication/AuthenticationQuery";
import {
  addRelationQuery,
  changeHeadUserQuery,
  changeUserpostActiveQuery,
  checkParticularUserMobileQuery,
  checkSubscriptionsQuery,
  checkUserRelationQuery,
  communicationUpdateQuery,
  getAllValidPackageQuery,
  getFamilyMembersQuery,
  getGSTQuery,
  getLanguageQuery,
  getPaymentTransactionHistoryQuery,
  getUserQuery,
  getVersionQuery,
  InsertSubscriptionQuery,
  InsertTransactionHistoryQuery,
  isFirstcheckSubscriptionsQuery,
  SelectPackageQuery,
  updatedSubscriptionQuery,
  updateRelationQuery,
  userUpdateQuery,
} from "./CommercialQuery";

const DB = require("../../Helper/DBConncetion");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const logger = require("../../Helper/Logger");

export const UserLoginModel = async (username: string, password: string) => {
  const connection = await DB();

  try {
    const values = [username];

    const result = await connection.query(usersigninQuery, values);

    if (result.rows.length > 0) {
      const hashpass = result.rows[0].refUserHashedpass;

      const passStatus = await bcrypt.compare(password, hashpass);

      const accessToken = jwt.sign(
        {
          userid: result.rows[0].refUserId,
          branch: "commercial",
        },
        process.env.ACCESS_TOKEN
      );

      if (passStatus) {
        if (result.rows[0].refRoleId === 3) {
          return {
            status: true,
            message: "Signin Successfull",
            roleType: result.rows[0].refRoleId,
            users: result.rows,
            isDetails: result.rows[0].refOccupationLvl === "-" ? true : false,
            token: accessToken,
          };
        } else
          return { status: false, message: "Invalid Username or Password" };
      } else {
        return { status: false, message: "Invalid Username or Password" };
      }
    } else {
      return { status: false, message: "Invalid Username or Password" };
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const UserSignUpModel = async (values: any) => {
  const connection = await DB();
  try {
    const nextUserIdData = await connection.query(nextUserId);

    await connection.query("BEGIN;");

    const checkMobileNumber = await connection.query(checkMobileNumberQuery, [
      values.refUserMobileno,
    ]);

    if (checkMobileNumber.rows.length < 1) {
      const patientId =
        100000 +
        parseInt(
          nextUserIdData.rows[0].nextrefusercustid
            ? nextUserIdData.rows[0].nextrefusercustid
            : 1
        );

      const getOverallId = await connection.query(overAllId);

      const newUservaluesInsert = [
        getOverallId.rows[0].overAllId,
        "USER" + patientId,
        "3",
        values.refUserFname,
        values.refUserLname,
        values.refDOB,
        values.refGender,
        values.refMaritalStatus,
        values.refEducation,
        values.refProfession,
        values.refSector,
        "active",
        values.createdAt,
        values.createdBy,
        "true",
      ];

      await connection.query(postNewUser, newUservaluesInsert);

      //   const getuseridVal = await connection.query(getUserId, [
      //     "USER" + patientId,
      //   ]);

      const newrefCommunicationValue = [
        getOverallId.rows[0].overAllId,
        values.refUserMobileno,
        values.refUserEmail,
        values.refAddress,
        values.refDistrict,
        values.refPincode,
        values.createdAt,
        values.createdBy,
      ];

      await connection.query(postnewCommunication, newrefCommunicationValue);

      const newUserDomainValue = [
        getOverallId.rows[0].overAllId,
        values.refUserPassword,
        values.hashedPassword,
        values.createdAt,
        values.createdBy,
      ];

      await connection.query(postnewUserDomain, newUserDomainValue);

      //addRelation
      await connection.query(addRelationQuery, [
        getOverallId.rows[0].overAllId,
        values.refUserMobileno,
        "Head User",
        true,
        values.createdAt,
        values.createdBy,
      ]);


      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const handleMultipleUserSigninModel = async (
  username,
  password,
  userId
) => {
  const connection = await DB();

  try {
    const values = [username, userId];

    const result = await connection.query(userParticularSiginQuery, values);

    if (result.rows.length > 0) {
      const hashpass = result.rows[0].refUserHashedpass;

      const passStatus = await bcrypt.compare(password, hashpass);

      const accessToken = jwt.sign(
        {
          userid: result.rows[0].refUserId,
          branch: "commercial",
        },
        process.env.ACCESS_TOKEN
      );

      if (passStatus) {
        return {
          status: true,
          message: "Signin Successfull",
          roleType: result.rows[0].refRoleId,
          isDetails: result.rows[0].refOccupationLvl === "-" ? true : false,
          token: accessToken,
        };
      } else {
        return { status: false, message: "Invalid Username or Password" };
      }
    } else {
      return { status: false, message: "Invalid Username or Password" };
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getUserModel = async (userId: any) => {
  const connection = await DB();
  try {
    const values = [userId];
    // console.log("values", values);

    const result = await connection.query(getUserQuery, values);
    // console.log("result", result);

    return {
      status: true,
      result: result.rows,
    };
  } catch (error) {
    console.error("Error in DB:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const userUpdateModel = async (id: any, values: any) => {
  const connection = await DB();

  try {
    const updateValues = [
      values.refUserFname,
      values.refUserLname,
      values.refDOB,
      values.refGender,
      values.refMaritalStatus,
      values.refEducation,
      values.refOccupationLvl,
      values.refSector,
      values.activeStatus,
      values.updatedBy,
      id,
    ];

    const updateCommuniction = [
      values.refUserEmail,
      values.refAddress,
      values.refDistrict,
      values.refPincode,
      id,
    ];
    console.log("updateValues", updateValues);
    await connection.query(userUpdateQuery, updateValues);
    // console.log('userupdate', userupdate)
    await connection.query(communicationUpdateQuery, updateCommuniction);
    // console.log('communicationUpdate', communicationUpdate)

    return {
      status: true,
      message: "update user Successfull",
      // userResult: userupdate.rows[0],
      // communicationResult: communicationUpdate.rows,
    };
  } catch (error) {
    logger.error(`User update failed for user ID: ${id}, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const deleteMultipleUserModel = async (
  id: any,
  updatedAt: any,
  updatedBy: any
) => {
  const connection = await DB();

  try {
    await Promise.all(
      id.map((element: any) =>
        connection.query(postActiveQuery, [
          "inactive",
          updatedAt,
          updatedBy,
          element,
        ])
      )
    );

    return {
      status: true,
    };
  } catch (error) {
    logger.error(
      `All user Delete Fail (deleteMultipleUserModel) : ${id}, Error: ${error}`
    );
    throw error;
  } finally {
    await connection.end();
  }
};

export const changeUserIdModel = async (
  id: any,
  headUserId: any,
  updatedAt: any,
  updatedBy: any
) => {
  const connection = await DB();
  try {
    //Delete the User
    await connection.query(changeUserpostActiveQuery, [
      "inactive",
      updatedAt,
      updatedBy,
      "false",
      id,
    ]);

    // Change the Head User
    await connection.query(changeHeadUserQuery, [
      "true",
      updatedAt,
      updatedBy,
      headUserId,
    ]);

    return {
      status: true,
    };
  } catch (error) {
    logger.error(`Changr the User and Delete: ${id}, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getAllValidPackageModel = async (
  currentDate: any,
  refUserId: any
) => {
  const connection = await DB();
  try {
    const result = await connection.query(getAllValidPackageQuery, [
      currentDate,
    ]);

    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      currentDate,
      refUserId,
    ]);

    const getGST = await connection.query(getGSTQuery);

    const isFirstPackage = await connection.query(isFirstcheckSubscriptionsQuery, [
      refUserId
    ])

    return {
      result: result.rows,
      packageStatus: checkSubscriptions.rows.length > 0 ? true : false,
      packageData:
        checkSubscriptions.rows.length > 0 ? checkSubscriptions.rows : [],
      isFirstPackage: isFirstPackage.rows.length > 0 ? false : true,
      getGST: getGST.rows,
      status: true,
    };
  } catch (error) {
    logger.error(`Getting the Package for user, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getOneValidPackageModel = async (
  packageId: any,
  currentDate: any,
  refUserId: any
) => {

  const connection = await DB();

  try {
    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      currentDate,
      refUserId,
    ]);

    if (checkSubscriptions.rows.length > 0) {
      const getGST = await connection.query(getGSTQuery);

      const oldPackage = checkSubscriptions.rows[0];

      const oldPackage_amount = parseFloat(oldPackage.refPkgAmount);

      const oldPackage_sgst = (parseFloat(getGST.rows[0].refSGST) / 100) * oldPackage_amount;
      const oldPackage_cgst = (parseFloat(getGST.rows[0].refCGST) / 100) * oldPackage_amount;

      const oneday_amount = oldPackage_amount / parseInt(oldPackage.refPkgValidDays);
      const oneday_sgst = oldPackage_sgst / parseInt(oldPackage.refPkgValidDays);
      const oneday_cgst = oldPackage_cgst / parseInt(oldPackage.refPkgValidDays);

      const minus_amount = (parseInt(oldPackage.refPkgValidDays) -
        calculateDaysDifference(
          oldPackage.refSubStartDate,
          currentDate.toISOString().split("T")[0]
        )) * oneday_amount;

      const minus_sgst = (parseInt(oldPackage.refPkgValidDays) -
        calculateDaysDifference(
          oldPackage.refSubStartDate,
          currentDate.toISOString().split("T")[0]
        )) * oneday_sgst;

      const minus_cgst = (parseInt(oldPackage.refPkgValidDays) -
        calculateDaysDifference(
          oldPackage.refSubStartDate,
          currentDate.toISOString().split("T")[0]
        )) * oneday_cgst;


      const totalminus = minus_amount + minus_cgst + minus_sgst;


      const result = await connection.query(SelectPackageQuery, [
        packageId,
        currentDate,
      ]);

      const newPackage = result.rows[0];

      const newPackage_amount = newPackage.refIsOffer
        ? parseFloat(newPackage.refPkgAmount) -
        (parseFloat(newPackage.refOfferPrice) / 100) * parseFloat(newPackage.refPkgAmount)
        : parseFloat(newPackage.refPkgAmount)
      const newPackage_sgst = (parseFloat(getGST.rows[0].refSGST) / 100) * newPackage_amount;
      const newPackage_cgst = (parseFloat(getGST.rows[0].refCGST) / 100) * newPackage_amount;

      const totalPackage = newPackage_amount + newPackage_cgst + newPackage_sgst;

      const totalAmount = totalPackage - totalminus;

      const isFirstPackage = await connection.query(isFirstcheckSubscriptionsQuery, [
        refUserId
      ])

      return {
        result: result.rows,
        minus_amount: Math.round(minus_amount * 100) / 100,
        minus_sgst: Math.round(minus_sgst * 100) / 100,
        minus_cgst: Math.round(minus_cgst * 100) / 100,
        totalminus: Math.round(totalminus * 100) / 100,
        newPackage_amount: Math.round(newPackage_amount * 100) / 100,
        newPackage_cgst: Math.round(newPackage_cgst * 100) / 100,
        newPackage_sgst: Math.round(newPackage_sgst * 100) / 100,
        totalPackage: Math.round(totalPackage * 100) / 100,
        totalPackageValue: Math.round(totalAmount * 100) / 100,
        isFirstPackage: isFirstPackage.rows.length > 0 ? false : true,
        getGST: getGST.rows,
        status: true,
      };
    } else {
      const result = await connection.query(SelectPackageQuery, [
        packageId,
        currentDate,
      ]);

      const getGST = await connection.query(getGSTQuery);

      const TotalAmount = parseFloat(result.rows[0].refPkgAmount) + ((parseFloat(getGST.rows[0].refSGST) / 100) * parseFloat(result.rows[0].refPkgAmount)) + (((parseFloat(getGST.rows[0].refCGST) / 100) * parseFloat(result.rows[0].refPkgAmount)))
      const isFirstPackage = await connection.query(isFirstcheckSubscriptionsQuery, [
        refUserId
      ])

      return {
        result: result.rows,
        getGST: getGST.rows,
        isFirstPackage: isFirstPackage.rows.length > 0 ? false : true,
        totalPackageValue: TotalAmount,
        status: true,
      };
    }
  } catch (error) {
    logger.error(`Getting the Package for user, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const purchasePackageModel = async (
  id: any,
  txnkey: any,
  packageId: any,
  method: any,
  createdAt: any,
  createdBy: any
) => {
  const connection = await DB();
  try {
    await connection.query("BEGIN;");

    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      id,
    ]);

    const getPackageQuery = await connection.query(SelectPackageQuery, [
      packageId,
      createdAt,
    ]);

    const packages = getPackageQuery.rows[0];

    if (getPackageQuery.rows.length === 1) {
      if (checkSubscriptions.rows.length > 0) {

        const getGST = await connection.query(getGSTQuery);

        const oldPackage = checkSubscriptions.rows[0];

        const oldPackage_amount = parseFloat(oldPackage.refPkgAmount);

        const oldPackage_sgst = (parseFloat(getGST.rows[0].refSGST) / 100) * oldPackage_amount;
        const oldPackage_cgst = (parseFloat(getGST.rows[0].refCGST) / 100) * oldPackage_amount;

        const oneday_amount = oldPackage_amount / parseInt(oldPackage.refPkgValidDays);
        const oneday_sgst = oldPackage_sgst / parseInt(oldPackage.refPkgValidDays);
        const oneday_cgst = oldPackage_cgst / parseInt(oldPackage.refPkgValidDays);

        const minus_amount = (oldPackage_amount -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            createdAt.toISOString().split("T")[0]
          )) * oneday_amount;

        const minus_sgst = (oldPackage_sgst -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            createdAt.toISOString().split("T")[0]
          )) * oneday_sgst;

        const minus_cgst = (oldPackage_cgst -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            createdAt.toISOString().split("T")[0]
          )) * oneday_cgst;

        const result = await connection.query(SelectPackageQuery, [
          packageId,
          createdAt,
        ]);

        const newPackage = result.rows[0];

        const newPackage_amount = newPackage.refIsOffer
          ? parseFloat(newPackage.refPkgAmount) -
          (parseFloat(newPackage.refOfferPrice) / 100) * parseFloat(newPackage.refPkgAmount)
          : parseFloat(newPackage.refPkgAmount)
        const newPackage_sgst = (parseFloat(getGST.rows[0].refSGST) / 100) * newPackage_amount;
        const newPackage_cgst = (parseFloat(getGST.rows[0].refCGST) / 100) * newPackage_amount;


        await connection.query(updatedSubscriptionQuery, [
          createdAt.toISOString().split("T")[0],
          createdAt,
          createdBy,
          oldPackage.refSubscriptionId
        ])


        const Subscription = await connection.query(InsertSubscriptionQuery, [
          packageId,
          id,
          createdAt.toISOString().split("T")[0],
          addDaysToDate(createdAt, packages.refPkgValidDays),
          createdAt,
          createdBy,
        ]);

        await connection.query(InsertTransactionHistoryQuery, [
          Subscription.rows[0].refSubscriptionId,
          id,
          packageId,
          newPackage_amount - minus_amount,
          newPackage_sgst - minus_sgst,
          newPackage_cgst - minus_cgst,
          method,
          createdAt,
          txnkey,
          true,
          createdAt,
          createdBy,
        ]);


        return {
          status: true,
        };
      } else {

        const Subscription = await connection.query(InsertSubscriptionQuery, [
          packageId,
          id,
          createdAt.toISOString().split("T")[0],
          addDaysToDate(createdAt, packages.refPkgValidDays),
          createdAt,
          createdBy,
        ]);

        const getGST = await connection.query(getGSTQuery);

        await connection.query(InsertTransactionHistoryQuery, [
          Subscription.rows[0].refSubscriptionId,
          id,
          packageId,
          packages.refIsOffer
            ? parseFloat(packages.refPkgAmount) -
            (parseFloat(packages.refOfferPrice) / 100) * packages.refPkgAmount
            : packages.refPkgAmount,
          Math.round(((parseFloat(getGST.rows[0].refSGST) / 100) * parseFloat(packages.refPkgAmount)) * 100) / 100,
          Math.round(((parseFloat(getGST.rows[0].refCGST) / 100) * parseFloat(packages.refPkgAmount)) * 100) / 100,
          method,
          createdAt,
          txnkey,
          true,
          createdAt,
          createdBy,
        ]);

        return {
          status: true,
        };
      }
    } else {
      return {
        message: "Invalid Package ID",
        status: false,
      };
    }
  } catch (error) {
    logger.error(`Getting the Package for user, Error: ${error}`);
    await connection.query("ROLLBACK;");
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const getPaymentTransactionHistoryModel = async (refUserId) => {
  const connection = await DB();
  try {
    const result = await connection.query(getPaymentTransactionHistoryQuery, [
      refUserId,
    ]);

    return {
      result: result.rows,
      status: true,
    };
  } catch (error) {
    logger.error(`Getting the Package for user, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getFamilyMembersModel = async (mobileNumber: any, createdAt: any, createdBy: any) => {
  const connection = await DB();
  try {

    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      createdBy,
    ]);

    const getFamilyMembers = await connection.query(getFamilyMembersQuery, [mobileNumber]);

    return {
      status: true,
      familyMembers: getFamilyMembers.rows,
      checkSubscriptions: checkSubscriptions.rows
    }

  } catch (error) {
    logger.error(`Getting the Family Users, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
}

export const postFamilyUserModel = async (values: any) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  try {

    const checkMobileNumber = await connection.query(checkMobileNumberQuery, [
      values.mobilenumber,
    ]);

    if (values.isSame ? true : checkMobileNumber.rows.length === 0) {
      const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
        createdAt,
        values.refUserId,
      ]);

      if (checkSubscriptions.rows.length > 0) {
        const getPassword = await connection.query(getPasswordQuery, [
          values.refUserId,
        ]);

        const password = getPassword.rows[0].refUserPassword;
        const hashedPassword = getPassword.rows[0].refUserHashedpass;

        const nextUserIdData = await connection.query(nextUserId);

        await connection.query("BEGIN;");

        const patientId =
          100000 +
          parseInt(
            nextUserIdData.rows[0].nextrefusercustid
              ? nextUserIdData.rows[0].nextrefusercustid
              : 1
          );

        const getOverallId = await connection.query(overAllId);

        const newUservaluesInsert = [
          getOverallId.rows[0].overAllId,
          values.branch === "commercial" ? "USER" + patientId : "MED" + patientId,
          "3",
          values.refUserFname,
          values.refUserLname,
          values.refDOB,
          values.refGender,
          values.refMaritalStatus,
          values.refEducation,
          values.refProfession,
          values.refSector,
          "active",
          createdAt,
          values.doctorId,
          "false",
        ];

        await connection.query(postNewUser, newUservaluesInsert);

        const newrefCommunicationValue = [
          getOverallId.rows[0].overAllId,
          values.isSame ? values.refUserMobileno : values.mobilenumber,
          values.refUserEmail,
          values.refAddress,
          values.refDistrict,
          values.refPincode,
          createdAt,
          values.doctorId,
        ];

        await connection.query(postnewCommunication, newrefCommunicationValue);

        const newUserDomainValue = [
          getOverallId.rows[0].overAllId,
          password,
          values.isSame ? hashedPassword : await bcrypt.hash(values.userpassword, 10),
          createdAt,
          values.doctorId,
        ];

        await connection.query(postnewUserDomain, newUserDomainValue);

        //addRelation
        await connection.query(addRelationQuery, [
          getOverallId.rows[0].overAllId,
          values.refUserMobileno,
          values.realtionType,
          true,
          createdAt,
          values.doctorId
        ]);


        return {
          status: true,
        };
      } else {
        return {
          message: "User Doesn't Purchase the Package",
          status: false,
        };
      }
    } else {
      return {
        message: "Mobile Number Already Exits",
        status: false
      }
    }




  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};


export const getParticularUserMobileNumberModel = async (userMobileNo: any, refUserId: any) => {
  const connection = await DB();
  try {

    const checkParticularUserMobile = await connection.query(checkParticularUserMobileQuery, [
      userMobileNo, refUserId
    ]);

    return {
      status: true,
      userData: checkParticularUserMobile.rows
    };

  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
}

export const linkFamilyMemberModel = async (refUserId: any, headMobileNumber: any, createdAt: any, createdBy: any, relationName: any, password: any) => {
  const connection = await DB();
  try {

    const mobileNoList = await connection.query(getUsersListMobileNo, [
      headMobileNumber,
    ]);


    if (mobileNoList.rows.length > 0) {

      const checkChangePass = await connection.query(changePasswordQuery, [
        mobileNoList.rows[0].refUserId, password
      ])


      if (checkChangePass.rows.length > 0) {

        const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
          createdAt,
          refUserId
        ]);


        if (checkSubscriptions.rows.length === 0) {

          // await connection.query(updateRelationQuery, [
          //   false,
          //   'No Family Memeber',
          //   createdAt,
          //   createdBy,
          //   refRelationId
          // ]);

          const checkUserRelation = await connection.query(checkUserRelationQuery, [refUserId, headMobileNumber]);



          if (checkUserRelation.rows.length > 0) {
            await connection.query(updateRelationQuery, [
              true,
              relationName,
              createdAt,
              createdBy,
              checkUserRelation.rows[0].refRId
            ]);
          } else {
            await connection.query(addRelationQuery, [
              refUserId,
              headMobileNumber,
              relationName,
              true,
              createdAt,
              createdBy,
            ])
          }

          return {
            status: true
          }

        } else {
          return {
            status: false,
            message: "User Already in the Another Subscription Plan"
          }
        }


      } else {
        return {
          status: false,
          message: "Invalid Password"
        }
      }

    } else {
      return {
        status: false,
        message: "Invalid Mobile Number"
      }
    }


  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }

}


export const unlinkFamilyMemberModel = async (refRelationId: any, updatedAt: any, updatedBy: any, password: any, headMobileNumber: any) => {
  const connection = await DB();
  try {

    const mobileNoList = await connection.query(getUsersListMobileNo, [
      headMobileNumber,
    ]);


    if (mobileNoList.rows.length > 0) {

      const checkChangePass = await connection.query(changePasswordQuery, [
        mobileNoList.rows[0].refUserId, password
      ])


      if (checkChangePass.rows.length > 0) {
        await connection.query(updateRelationQuery, [
          false,
          'No Family Memeber',
          updatedAt,
          updatedBy,
          refRelationId
        ]);

        return {
          status: true
        }


      } else {
        return {
          status: false,
          message: "Invalid Password"
        }
      }

    } else {
      return {
        status: false,
        message: "Invalid Mobile Number"
      }
    }


  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }

}

export const getDashbardModel = async (refUserId: any, createdAt: any) => {
  const connection = await DB();
  try {
    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      refUserId
    ]);

    const isHigherQuestion = await connection.query(getAssessmentNoQuery, [
      refUserId, ['9', '10', '11', '43']
    ]);

    const isLowerQuestion = await connection.query(getAssessmentNoQuery, [
      refUserId, ['8', '12', '13', '51']
    ]);

    const version = await connection.query(getVersionQuery);

    return {
      status: true,
      checkSubscriptions: checkSubscriptions.rows,
      isHigherQuestion: isHigherQuestion.rows,
      isLowerQuestion: isLowerQuestion.rows,
      version: version.rows
    }

  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }

}

export const getLanguageModel = async () => {
  const connection = await DB();
  try {

    const getLanguage = await connection.query(getLanguageQuery);

    return {
      status: true,
      getLanguage: getLanguage.rows
    }

  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }

}

export const getVersionModel = async () => {
  const connection = await DB();
  try {

    const version = await connection.query(getVersionQuery);

    return {
      status: true,
      version: version.rows
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
}