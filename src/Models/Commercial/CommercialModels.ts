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
  EmailIDForPayment,
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
  UserEmailForPayment,
  userUpdateQuery,
} from "./CommercialQuery";
import {
  emailContForPackageUpgrade,
  emailContForPaymentUpgrade,
} from "./mailContents";
import { sendEmail } from "../../Helper/mail";
import axios from "axios";

import moment from "moment";

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

    const isFirstPackage = await connection.query(
      isFirstcheckSubscriptionsQuery,
      [refUserId]
    );

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

      const oldPackage_sgst =
        (parseFloat(getGST.rows[0].refSGST) / 100) * oldPackage_amount;
      const oldPackage_cgst =
        (parseFloat(getGST.rows[0].refCGST) / 100) * oldPackage_amount;

      const oneday_amount =
        oldPackage_amount / parseInt(oldPackage.refPkgValidDays);
      const oneday_sgst =
        oldPackage_sgst / parseInt(oldPackage.refPkgValidDays);
      const oneday_cgst =
        oldPackage_cgst / parseInt(oldPackage.refPkgValidDays);

      const minus_amount =
        (parseInt(oldPackage.refPkgValidDays) -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            currentDate.toISOString().split("T")[0]
          )) *
        oneday_amount;

      const minus_sgst =
        (parseInt(oldPackage.refPkgValidDays) -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            currentDate.toISOString().split("T")[0]
          )) *
        oneday_sgst;

      const minus_cgst =
        (parseInt(oldPackage.refPkgValidDays) -
          calculateDaysDifference(
            oldPackage.refSubStartDate,
            currentDate.toISOString().split("T")[0]
          )) *
        oneday_cgst;

      const totalminus = minus_amount + minus_cgst + minus_sgst;

      const result = await connection.query(SelectPackageQuery, [
        packageId,
        currentDate,
      ]);

      const newPackage = result.rows[0];

      const newPackage_amount = newPackage.refIsOffer
        ? parseFloat(newPackage.refPkgAmount) -
          (parseFloat(newPackage.refOfferPrice) / 100) *
            parseFloat(newPackage.refPkgAmount)
        : parseFloat(newPackage.refPkgAmount);
      const newPackage_sgst =
        (parseFloat(getGST.rows[0].refSGST) / 100) * newPackage_amount;
      const newPackage_cgst =
        (parseFloat(getGST.rows[0].refCGST) / 100) * newPackage_amount;

      const totalPackage =
        newPackage_amount + newPackage_cgst + newPackage_sgst;

      const totalAmount = totalPackage - totalminus;

      const isFirstPackage = await connection.query(
        isFirstcheckSubscriptionsQuery,
        [refUserId]
      );

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

      const TotalAmount =
        parseFloat(result.rows[0].refPkgAmount) +
        (parseFloat(getGST.rows[0].refSGST) / 100) *
          parseFloat(result.rows[0].refPkgAmount) +
        (parseFloat(getGST.rows[0].refCGST) / 100) *
          parseFloat(result.rows[0].refPkgAmount);
      const isFirstPackage = await connection.query(
        isFirstcheckSubscriptionsQuery,
        [refUserId]
      );

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
    logger.info("packages", packages);
    logger.info("packageId", txnkey);

    const key_id = process.env.VITE_RZR_API_KEY;
    logger.info(`key_id ${key_id}`);
    const key_secret = process.env.VITE_RZR_SKT_KEY;
    logger.info("key_secret", key_secret);

    const authToken = btoa(`${key_id}:${key_secret}`);
    logger.info("authToken", authToken);

    if (getPackageQuery.rows.length === 1) {
      if (checkSubscriptions.rows.length > 0) {
        const getGST = await connection.query(getGSTQuery);

        const oldPackage = checkSubscriptions.rows[0];

        const oldPackage_amount = parseFloat(oldPackage.refPkgAmount);

        const oldPackage_sgst =
          (parseFloat(getGST.rows[0].refSGST) / 100) * oldPackage_amount;
        const oldPackage_cgst =
          (parseFloat(getGST.rows[0].refCGST) / 100) * oldPackage_amount;

        const oneday_amount =
          oldPackage_amount / parseInt(oldPackage.refPkgValidDays);
        const oneday_sgst =
          oldPackage_sgst / parseInt(oldPackage.refPkgValidDays);
        const oneday_cgst =
          oldPackage_cgst / parseInt(oldPackage.refPkgValidDays);

        const minus_amount =
          (parseInt(oldPackage.refPkgValidDays) -
            calculateDaysDifference(
              oldPackage.refSubStartDate,
              createdAt.toISOString().split("T")[0]
            )) *
          oneday_amount;

        const minus_sgst =
          (parseInt(oldPackage.refPkgValidDays) -
            calculateDaysDifference(
              oldPackage.refSubStartDate,
              createdAt.toISOString().split("T")[0]
            )) *
          oneday_sgst;

        const minus_cgst =
          (parseInt(oldPackage.refPkgValidDays) -
            calculateDaysDifference(
              oldPackage.refSubStartDate,
              createdAt.toISOString().split("T")[0]
            )) *
          oneday_cgst;

        const result = await connection.query(SelectPackageQuery, [
          packageId,
          createdAt,
        ]);

        const newPackage = result.rows[0];

        const newPackage_amount = newPackage.refIsOffer
          ? parseFloat(newPackage.refPkgAmount) -
            (parseFloat(newPackage.refOfferPrice) / 100) *
              parseFloat(newPackage.refPkgAmount)
          : parseFloat(newPackage.refPkgAmount);
        const newPackage_sgst =
          (parseFloat(getGST.rows[0].refSGST) / 100) * newPackage_amount;
        const newPackage_cgst =
          (parseFloat(getGST.rows[0].refCGST) / 100) * newPackage_amount;
        logger.info("newPackage_amount", newPackage_amount);
        logger.info("newPackage_sgst", newPackage_sgst);
        logger.info("newPackage_cgst", newPackage_cgst);

        await connection.query(updatedSubscriptionQuery, [
          createdAt.toISOString().split("T")[0],
          createdAt,
          createdBy,
          oldPackage.refSubscriptionId,
        ]);

        const UserEmailQuery = await connection.query(UserEmailForPayment, [
          id,
        ]);

        const resultData = UserEmailQuery.rows;

        if (resultData.length > 0) {
          const refUserEmail = resultData[0].refUserEmail;
          logger.info("refUserEmail", refUserEmail);
        } else {
          logger.info("No user found.");
        }

        const { refPkgName, refTransactionAmount } = checkSubscriptions.rows[0];

        logger.info("Old Plan Name:", refPkgName);
        logger.info("Transaction Amount:", refTransactionAmount);

        const mailProgress = async () => {
          const sendEmailCont = {
            to: resultData[0].refUserEmail,
            subject: "Subscription Payment Upgraded Successful",
            html: emailContForPackageUpgrade(
              `${resultData[0].refUserFname} ${resultData[0].refUserLname}`,
              resultData[0].refPkgName, // new plan
              refPkgName, // old plan
              resultData[0].refTransactionAmount +
                resultData[0].refTransactionSGST +
                resultData[0].refTransactionCGST,
              resultData[0].refTransactionKey,
              resultData[0].refTransactionDate,
              resultData[0].refTransactionMethod,
              resultData[0].refSubStartDate,
              resultData[0].refSubEndDate,
              "Medpredit"
            ),
          };

          try {
            await sendEmail(sendEmailCont);
            console.log(
              "sendEmailCont",
              process.env.EMAIL_USER,
              process.env.EMAIL_PASS
            );
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        };

        mailProgress().catch(console.error);

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
          parseFloat((newPackage_amount - minus_amount).toFixed(2)),
          parseFloat((newPackage_sgst - minus_sgst).toFixed(2)),
          parseFloat((newPackage_cgst - minus_cgst).toFixed(2)),
          method,
          createdAt,
          txnkey,
          true,
          createdAt,
          createdBy,
        ]);

        logger.info("newPackage_amount", newPackage_amount);
        logger.info("minus_amount", minus_amount);
        logger.info("newPackage_sgst", newPackage_sgst);
        logger.info("newPackage_cgst", newPackage_cgst);
        logger.info("minus_sgst", minus_sgst);
        logger.info("minus_cgst", minus_cgst);
        const grandTotal =
          Number(newPackage_amount) -
          Number(minus_amount) +
          Number(newPackage_sgst) -
          Number(minus_sgst) +
          Number(newPackage_cgst) -
          Number(minus_cgst);

        const finalAmount = grandTotal * 100;
        logger.info("grandTotal LINE 764", finalAmount);

        axios
          .post(
            `https://api.razorpay.com/v1/payments/${txnkey}/capture`,
            {
              amount: Math.round(finalAmount),
              currency: "INR",
            },
            {
              headers: {
                Authorization: `Basic ${authToken}`, // 🔐 Correct header
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            logger.info("Payment captured successfully:", res.data);
          })
          .catch((err) => {
            console.error(
              "Error capturing payment:",
              err.response?.data || err
            );
          });

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
            ? parseFloat(
                (
                  parseFloat(packages.refPkgAmount) -
                  (parseFloat(packages.refOfferPrice) / 100) *
                    packages.refPkgAmount
                ).toFixed(2)
              )
            : parseFloat(packages.refPkgAmount).toFixed(2),
          Math.round(
            (parseFloat(getGST.rows[0].refSGST) / 100) *
              parseFloat(packages.refPkgAmount) *
              100
          ) / 100,
          Math.round(
            (parseFloat(getGST.rows[0].refCGST) / 100) *
              parseFloat(packages.refPkgAmount) *
              100
          ) / 100,
          method,
          createdAt,
          txnkey,
          true,
          createdAt,
          createdBy,
        ]);

        logger.info("id", id);
        const UserEmailQuery = await connection.query(EmailIDForPayment, [id]);
        console.log("UserEmailQuery", UserEmailQuery);
        logger.info("UserEmailQuery else", UserEmailQuery.rows);

        const resultData = UserEmailQuery.rows;
        console.log("resultData", resultData);
        logger.info("resultData", resultData);

        if (resultData.length > 0) {
          const refUserEmail = resultData[0].refUserEmail;
          console.log("refUserEmail", refUserEmail);
          logger.info("refUserEmail", refUserEmail);
        } else {
          logger.info("No user found.");
        }

        const mailProgress = async () => {
          const sendEmailCont = {
            to: resultData[0].refUserEmail,
            subject: "Subscription Payment Successful",
            html: emailContForPaymentUpgrade(
              resultData[0].refUserFname + resultData[0].refUserLname,
              resultData[0].refPkgName,
              resultData[0].refTransactionAmount +
                resultData[0].refTransactionSGST +
                resultData[0].refTransactionCGST,
              resultData[0].refTransactionKey,
              resultData[0].refTransactionDate,
              resultData[0].refTransactionMethod,
              resultData[0].refSubStartDate,
              resultData[0].refSubEndDate,
              "Medpredit"
            ),
          };

          try {
            await sendEmail(sendEmailCont);
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        };

        mailProgress().catch(console.error);

        const grandTotal =
          resultData[0].refTransactionAmount +
          resultData[0].refTransactionSGST +
          resultData[0].refTransactionCGST;

        const finalAmount = grandTotal * 100;
        logger.info("grandTotal", finalAmount);

        axios
          .post(
            `https://api.razorpay.com/v1/payments/${txnkey}/capture`,
            {
              amount: Math.round(finalAmount),
              currency: "INR",
            },
            {
              headers: {
                Authorization: `Basic ${authToken}`, // 🔐 Correct header
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            logger.info("Payment captured successfully:", res.data);
          })
          .catch((err) => {
            console.error(
              "Error capturing payment:",
              err.response?.data || err
            );
          });

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

export const getFamilyMembersModel = async (
  mobileNumber: any,
  createdAt: any,
  createdBy: any
) => {
  const connection = await DB();
  try {
    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      createdBy,
    ]);

    const getFamilyMembers = await connection.query(getFamilyMembersQuery, [
      mobileNumber,
    ]);

    return {
      status: true,
      familyMembers: getFamilyMembers.rows,
      checkSubscriptions: checkSubscriptions.rows,
    };
  } catch (error) {
    logger.error(`Getting the Family Users, Error: ${error}`);
    throw error;
  } finally {
    await connection.end();
  }
};

export const postFamilyUserModel = async (values: any) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  try {
    const checkMobileNumber = await connection.query(checkMobileNumberQuery, [
      values.mobilenumber,
    ]);

    if (values.isSame ? true : checkMobileNumber.rows.length === 0) {
      const checkSubscriptions = await connection.query(
        checkSubscriptionsQuery,
        [createdAt, values.refUserId]
      );

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
          values.branch === "commercial"
            ? "USER" + patientId
            : "MED" + patientId,
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
          values.isSame
            ? hashedPassword
            : await bcrypt.hash(values.userpassword, 10),
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
          values.doctorId,
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

export const getParticularUserMobileNumberModel = async (
  userMobileNo: any,
  refUserId: any
) => {
  const connection = await DB();
  try {
    const checkParticularUserMobile = await connection.query(
      checkParticularUserMobileQuery,
      [userMobileNo, refUserId]
    );

    return {
      status: true,
      userData: checkParticularUserMobile.rows,
    };
  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const linkFamilyMemberModel = async (
  refUserId: any,
  headMobileNumber: any,
  createdAt: any,
  createdBy: any,
  relationName: any,
  password: any
) => {
  const connection = await DB();
  try {
    const mobileNoList = await connection.query(getUsersListMobileNo, [
      headMobileNumber,
    ]);

    if (mobileNoList.rows.length > 0) {
      const checkChangePass = await connection.query(changePasswordQuery, [
        mobileNoList.rows[0].refUserId,
        password,
      ]);

      if (checkChangePass.rows.length > 0) {
        const checkSubscriptions = await connection.query(
          checkSubscriptionsQuery,
          [createdAt, refUserId]
        );

        if (checkSubscriptions.rows.length === 0) {
          // await connection.query(updateRelationQuery, [
          //   false,
          //   'No Family Memeber',
          //   createdAt,
          //   createdBy,
          //   refRelationId
          // ]);

          const checkUserRelation = await connection.query(
            checkUserRelationQuery,
            [refUserId, headMobileNumber]
          );

          if (checkUserRelation.rows.length > 0) {
            await connection.query(updateRelationQuery, [
              true,
              relationName,
              createdAt,
              createdBy,
              checkUserRelation.rows[0].refRId,
            ]);
          } else {
            await connection.query(addRelationQuery, [
              refUserId,
              headMobileNumber,
              relationName,
              true,
              createdAt,
              createdBy,
            ]);
          }

          return {
            status: true,
          };
        } else {
          return {
            status: false,
            message: "User Already in the Another Subscription Plan",
          };
        }
      } else {
        return {
          status: false,
          message: "Invalid Password",
        };
      }
    } else {
      return {
        status: false,
        message: "Invalid Mobile Number",
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

export const unlinkFamilyMemberModel = async (
  refRelationId: any,
  updatedAt: any,
  updatedBy: any,
  password: any,
  headMobileNumber: any
) => {
  const connection = await DB();
  try {
    const mobileNoList = await connection.query(getUsersListMobileNo, [
      headMobileNumber,
    ]);

    if (mobileNoList.rows.length > 0) {
      const checkChangePass = await connection.query(changePasswordQuery, [
        mobileNoList.rows[0].refUserId,
        password,
      ]);

      if (checkChangePass.rows.length > 0) {
        await connection.query(updateRelationQuery, [
          false,
          "No Family Memeber",
          updatedAt,
          updatedBy,
          refRelationId,
        ]);

        return {
          status: true,
        };
      } else {
        return {
          status: false,
          message: "Invalid Password",
        };
      }
    } else {
      return {
        status: false,
        message: "Invalid Mobile Number",
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

export const getDashbardModel = async (refUserId: any, createdAt: any) => {
  const connection = await DB();
  try {
    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      refUserId,
    ]);

    const isHigherQuestion = await connection.query(getAssessmentNoQuery, [
      refUserId,
      ["9", "10", "11", "43"],
    ]);

    const isLowerQuestion = await connection.query(getAssessmentNoQuery, [
      refUserId,
      ["8", "12", "13", "51"],
    ]);

    const version = await connection.query(getVersionQuery);

    return {
      status: true,
      checkSubscriptions: checkSubscriptions.rows,
      isHigherQuestion: isHigherQuestion.rows,
      isLowerQuestion: isLowerQuestion.rows,
      version: version.rows,
    };
  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const getLanguageModel = async () => {
  const connection = await DB();
  try {
    const getLanguage = await connection.query(getLanguageQuery);

    return {
      status: true,
      getLanguage: getLanguage.rows,
    };
  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const getVersionModel = async () => {
  const connection = await DB();
  try {
    const version = await connection.query(getVersionQuery);

    return {
      status: true,
      version: version.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const validatePasswordModel = async (email, inputOtp, userId) => {
  console.log("userId", userId);
  console.log("inputOtp", inputOtp);
  console.log("email", email);
  const connection = await DB();
  try {
    const result = await connection.query(
      `
      SELECT 
        "tempOTPNumber", 
        "createdAt" 
      FROM public."tempOTP" 
      WHERE "tempUserId" = $1 
      ORDER BY "createdAt" DESC
      LIMIT 1
      `,
      [userId]
    );

    console.log("result", result);
    const rows = result.rows;
    console.log("rows", rows);

    if (!rows || rows.length === 0) {
      return {
        status: false,
        message: "No OTP found for the given email",
      };
    }

    const { tempOTPNumber, createdAt } = rows[0];
    console.log("tempOTPNumber", tempOTPNumber);

    const createdTime = new Date(createdAt);
    console.log("createdTime", createdTime);
    const now = new Date();
    const expiryTime = new Date(createdTime.getTime() + 5 * 60 * 1000);

    if (now > expiryTime) {
      return {
        status: false,
        message: "OTP has expired",
      };
    }

    if (inputOtp !== tempOTPNumber) {
      return {
        status: false,
        message: "Invalid OTP",
      };
    }

    return {
      status: true,
      message: "OTP validated successfully",
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const GenerateOTPMail = async (email, otp) => {
  const connection = await DB();

  const success = await sendEmail({
    to: email,
    subject: "OTP for Password Reset",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    // Optionally use HTML format
    // html: `<b>Your OTP is:</b> <h3>${otp}</h3>`
  });
  if (!success) {
    return {
      status: false,
      token: process.env.ACCESS_TOKEN,
      message: "Password OTP sent got error",
    };
  }

  const userIdQuery = `
  SELECT rcu."refUserId" FROM public."refCommunication" rcu WHERE
  rcu."refUserEmail" = $1`;

  const userIdResult = await connection.query(userIdQuery, [email]);
  console.log("userIdResult", userIdResult.rows[0]);

  const query = `
    INSERT INTO public."tempOTP" (
      "tempUserId", 
      "tempOTPNumber", 
      "tempOTPExpiresTime", 
      "createdAt", 
      "createdBy"
    )
    VALUES (
      $1, 
      $2, 
      to_char(NOW() + INTERVAL '5 minutes', 'YYYY-MM-DD HH24:MI:SS'), 
      to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'), 
      $3
    )
  `;

  const result = await connection.query(query, [
    userIdResult.rows[0].refUserId,
    otp,
    email,
  ]);

  console.log("result", result);
  // Store OTP logic here (in memory, Redis, etc.)
  return {
    status: true,
    userId: userIdResult.rows[0],
    token: process.env.ACCESS_TOKEN,
    message: "Password OTP sent successfully",
  };
};

export const ForgotPasswordModel = async (email, newPassword) => {
  const connection = await DB();

  try {
    const query = `
      SELECT rud."refUserId"
      FROM public."refCommunication" rcn
      JOIN public."refUserDomain" rud ON rcn."refUserId" = rud."refUserId"
      WHERE rcn."refUserEmail" = $1
    `;

    const result = await connection.query(query, [email]);

    if (result.rowCount === 0) {
      return { status: false, message: "User not found" };
    }

    const userId = result.rows[0].refUserId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save both plaintext and hashed password (NOT RECOMMENDED in production)
    const updateQuery = `
      UPDATE public."refUserDomain"
      SET "refUserPassword" = $1,
          "refUserHashedpass" = $2
      WHERE "refUserId" = $3
    `;

    await connection.query(updateQuery, [newPassword, hashedPassword, userId]);

    return {
      status: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("ForgotPasswordModel error:", error);
    throw error;
  } finally {
    await connection.end(); // If not using connection pool
  }
};

export const UpdatePasswordModel = async (userId, password, email) => {
  const connection = await DB();
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updateQuery = `
      UPDATE public."refUserDomain"
      SET "refUserPassword" = $1,
          "refUserHashedpass" = $2,
          "updatedAt" = CURRENT_TIMESTAMP,
          "updatedBy" = 'system'
      WHERE "refUserId" = $3
    `;

    const result = await connection.query(updateQuery, [
      password,
      hashedPassword,
      userId,
    ]);

    console.log("result", result);
    return {
      status: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("ForgotPasswordModel error:", error);
    throw error;
  } finally {
    await connection.end(); // If not using connection pool
  }
};

export const UploadMedicalRecordsModel = async (data) => {
  const {
    userId,
    filePath,
    date,
    category,
    subCategory,
    centerName,
    notes,
    docName,
  } = data;

  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
      INSERT INTO "medicalRecords" 
        ("refUserId", "refDocPath", "refDateOfDoc", "refCategory", 
         "refSubCategory", "refMedicalCenterName", "refAdditionalNotes", 
         "refCreatedAt", "refCreatedBy", "refUpdatedAt", "refUpdatedBy", "refDocName")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $1, $8, $1, $9)
      RETURNING "refDocId"
    `;

    const values = [
      userId,
      filePath,
      date,
      category,
      subCategory,
      centerName,
      notes,
      now,
      docName,
    ];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Medical record uploaded successfully.",
      docId: result.rows[0].refDocId,
    };
  } catch (error) {
    console.error("UploadMedicalRecordsModel error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const GetMedicalRecordsByUserModel = async (userId) => {
  const connection = await DB();
  try {
    const query = `
      SELECT 
        "refDocId",
        "refDocName",
        "refDocPath",
        "refDateOfDoc",
        "refCategory",
        "refSubCategory",
        "refMedicalCenterName",
        "refAdditionalNotes",
        "refCreatedAt"
      FROM "medicalRecords"
      WHERE "refUserId" = $1
      ORDER BY "refCreatedAt" DESC
    `;
    const result = await connection.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("GetMedicalRecordsByUserModel error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getDocumentPathById = async (refDocId) => {
  const connection = await DB();

  try {
    const query = `SELECT "refDocPath" FROM "medicalRecords" WHERE "refDocId" = $1`;
    const result = await connection.query(query, [refDocId]);
    console.log("result", result.rows[0]);
    return result.rows[0] || null;
  } finally {
    await connection.end();
  }
};

