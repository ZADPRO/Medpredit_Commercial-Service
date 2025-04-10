import { getDateOnly } from "../../Helper/CurrentTime";
import {
  checkMobileNumberQuery,
  getUserId,
  nextUserId,
  overAllId,
  postnewUserDomain,
} from "../Assistant/AssistantQuery";
import {
  addStaffAssistantMap,
  addStaffCommunicationQuery,
  addStaffDoctorMap,
  addStaffDomainQuery,
  addStaffExprienceQuery,
  addStaffUserQuery,
  getAssistantList,
  getDetailsQuery,
  getDoctorList,
  getDoctorListActive,
  getDoctorMapList,
  getUserActiveStatus,
  getUsersListMobileNo,
  nextDoctorId,
  nextStaffId,
  postActiveQuery,
  updateMobilenumberQuery,
  userParticularSiginQuery,
} from "./AuthenticationQuery";

const DB = require("../../Helper/DBConncetion");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const {
  usersigninQuery,
  patientDataCheckQuery,
  doctorDataCheckQuery,
  assistantMapping,
  checkDoctorHospitalQuery,
  changePasswordQuery,
  updatePasswordQuery,
} = require("./AuthenticationQuery");

export const usersigninModel = async (username: string, password: string) => {
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
        },
        process.env.ACCESS_TOKEN
      );

      if (passStatus) {
        if (
          result.rows[0].refRoleId === 1 ||
          result.rows[0].refRoleId === 5 ||
          result.rows[0].refRoleId === 4
        ) {
          const checkDoctorHospital = await connection.query(
            checkDoctorHospitalQuery,
            [result.rows[0].refUserId]
          );

          if (checkDoctorHospital.rows.length === 1) {
            return {
              status: true,
              message: "Signin Successfull",
              roleType: result.rows[0].refRoleId,
              hospitaId: checkDoctorHospital.rows[0].refHospitalId,
              token: accessToken,
              action: "single",
            };
          } else {
            return {
              status: true,
              message: "Signin Successfull",
              roleType: result.rows[0].refRoleId,
              hospitals: checkDoctorHospital.rows,
              token: accessToken,
              action: "multiple",
            };
          }
        } else if (result.rows[0].refRoleId === 2) {
          const hospitaId = await connection.query(assistantMapping, [
            result.rows[0].refUserId,
          ]);

          return {
            status: true,
            message: "Signin Successfull",
            roleType: result.rows[0].refRoleId,
            hospitaId: hospitaId.rows[0].refHospitalId,
            token: accessToken,
          };
        } else if (result.rows[0].refRoleId === 3) {
          return {
            status: true,
            message: "Signin Successfull",
            roleType: result.rows[0].refRoleId,
            users: result.rows,
            token: result.rows.length === 1 ? accessToken : null,
            action: result.rows.length === 1 ? "single" : "multiple",
          };
        }
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

export const handleUserSigninModel = async (username, password, userId) => {
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
        },
        process.env.ACCESS_TOKEN
      );

      if (passStatus) {
        return {
          status: true,
          message: "Signin Successfull",
          roleType: result.rows[0].refRoleId,
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

export const verifyEnteruserDataModel = async (
  roleType: number,
  userId: number
) => {
  const connection = await DB();

  if (roleType === 1 || roleType === 2) {
    const result = await connection.query(doctorDataCheckQuery, [userId]);

    return { status: result.rows[0].result };
  } else if (roleType === 3) {
    const result = await connection.query(patientDataCheckQuery, [userId]);

    return { status: result.rows[0].result };
  }
};

export const changePasswordModel = async (
  userid: any,
  pastPassword: any,
  currentPassword: any,
  roleId: any
) => {
  const connection = await DB();

  try {
    if (roleId === 3) {
      const result = await connection.query(changePasswordQuery, [
        userid,
        pastPassword,
      ]);

      if (result.rows.length > 0) {
        try {
          const mobileNoList = await connection.query(getUsersListMobileNo, [
            result.rows[0].refUserMobileno,
          ]);

          const saltRounds = 10; // Adjust the salt rounds as needed
          const hashedPassword = await bcrypt.hash(currentPassword, saltRounds);

          await Promise.all(
            mobileNoList.rows.map(async (element: any) => {
              await connection.query(updatePasswordQuery, [
                currentPassword,
                hashedPassword,
                element.refUserId,
              ]);

              console.log("====================================");
              console.log(currentPassword, hashedPassword, element.refUserId);
              console.log("====================================");
            })
          );
        } catch (error) {
          console.error("Something went wrong:", error);
        }

        return {
          status: true,
        };
      } else {
        return {
          status: false,
          message: "Invalid Current Password",
        };
      }
    } else {
      const result = await connection.query(changePasswordQuery, [
        userid,
        pastPassword,
      ]);

      if (result.rows.length > 0) {
        const saltRounds = 10; // Adjust the salt rounds as needed
        const hashedPassword = await bcrypt.hash(currentPassword, saltRounds);

        const result = await connection.query(updatePasswordQuery, [
          currentPassword,
          hashedPassword,
          userid,
        ]);

        if (result) {
          return {
            status: true,
          };
        } else {
          return {
            status: false,
            message: "Try Again",
          };
        }
      } else {
        return {
          status: false,
          message: "Invalid Current Password",
        };
      }
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const ChangeMobileNumberModel = async (
  userid: any,
  newMobileno: any,
  password: any,
  roleId: any
) => {
  const connection = await DB();
  try {
    const createdAt = getDateOnly();
    const getDetails = await connection.query(getDetailsQuery, [userid]);

    if (getDetails.rows.length > 0) {
      const hashpass = getDetails.rows[0].refUserHashedpass;

      const passStatus = await bcrypt.compare(password, hashpass);

      if (passStatus) {
        const result = await connection.query(usersigninQuery, [newMobileno]);

        if (result.rows.length === 0) {
          console.log(roleId);

          if (roleId === 3) {
            const mobileList = await connection.query(usersigninQuery, [
              getDetails.rows[0].refUserMobileno,
            ]);

            await Promise.all(
              mobileList.rows.map((element) =>
                connection.query(updateMobilenumberQuery, [
                  newMobileno,
                  createdAt,
                  userid,
                  element.refUserId,
                ])
              )
            );

            return {
              status: true,
            };
          } else {
            await connection.query(updateMobilenumberQuery, [
              newMobileno,
              createdAt,
              userid,
              userid,
            ]);

            return {
              status: true,
            };
          }
        } else {
          return {
            status: false,
            message: "Mobile Number Already Taken",
          };
        }
      } else {
        return {
          status: false,
          message: "Invalid Password",
        };
      }
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getUserListModel = async (roleId, hospitalId) => {
  const connection = await DB();

  try {
    let getUserList;

    console.log("====================================");
    console.log(roleId);
    console.log("====================================");

    if (roleId === "1") {
      getUserList = await connection.query(getDoctorListActive, [hospitalId]);
    } else if (roleId === "2") {
      getUserList = await connection.query(getAssistantList, [
        roleId,
        hospitalId,
      ]);
    } else if (roleId === "3") {
      getUserList = await connection.query(getDoctorList, [hospitalId]);
    }

    return {
      status: true,
      userList: getUserList.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const signUpDoctorsModels = async (values: any) => {
  const connection = await DB();
  try {
    await connection.query("BEGIN;");

    let nextUserIdData;

    if (values.refRoleId === "1" || values.refRoleId === "4") {
      nextUserIdData = await connection.query(nextDoctorId);
    } else if (values.refRoleId === "2") {
      nextUserIdData = await connection.query(nextStaffId, [values.refRoleId]);
    }

    const checkMobileNumber = await connection.query(checkMobileNumberQuery, [
      values.refUserMobileno,
    ]);

    if (checkMobileNumber.rows.length === 0) {
      const patientId =
        100000 +
        parseInt(
          nextUserIdData.rows[0].nextrefusercustid
            ? nextUserIdData.rows[0].nextrefusercustid
            : 1
        );

      const getOverallId = await connection.query(overAllId);

      let custId = "";

      if (values.refRoleId === "1" || values.refRoleId === "4") {
        custId = "DOC" + patientId;
      } else if (values.refRoleId === "2") {
        custId = "AST" + patientId;
      }

      await connection.query(addStaffUserQuery, [
        values.createdAt,
        values.createdBy,
        values.refDOB,
        values.refGender,
        values.refMaritalStatus,
        values.refRoleId,
        custId,
        values.refUserFname,
        values.refUserLname,
        "active",
        getOverallId.rows[0].overAllId,
      ]);

      // const getuseridVal = await connection.query(getUserId, [custId]);

      if (values.refRoleId === "1" || values.refRoleId === "4") {
        await connection.query(addStaffDoctorMap, [
          values.hospitalId,
          getOverallId.rows[0].overAllId,
          values.createdAt,
          values.createdBy,
        ]);

        values.selectedUsers.map(async (element) => {
          await connection.query(addStaffAssistantMap, [
            getOverallId.rows[0].overAllId,
            element.code,
            values.createdAt,
            values.createdBy,
          ]);
        });
      } else if (values.refRoleId === "2") {
        values.selectedUsers.map(async (element) => {
          await connection.query(addStaffAssistantMap, [
            element.code,
            getOverallId.rows[0].overAllId,
            values.createdAt,
            values.createdBy,
          ]);
        });
      }

      await connection.query(addStaffCommunicationQuery, [
        values.createdAt,
        values.createdBy,
        values.refAddress,
        values.refDistrict,
        values.refPincode,
        values.refUserEmail,
        getOverallId.rows[0].overAllId,
        values.refUserMobileno,
      ]);

      await connection.query(addStaffDomainQuery, [
        getOverallId.rows[0].overAllId,
        values.allopathic,
        values.education,
        values.educationSpecialization,
        values.superSpecialization || "",
        values.supSpecialization || "",
        values.additionalDegree || "",
        values.degreeType || "",
        values.degreeSpecialization || "",
        values.medicalCouncil,
        values.mciRegisteredNo,
        values.typeHealthcare,
        values.instituteType,
        values.nameInstitute,
        values.designation,
        values.department,
        values.instituteAddress,
        values.createdAt,
        values.createdBy,
      ]);

      if (values.previousWork.length > 0) {
        values.previousWork.map(async (element) => {
          await connection.query(addStaffExprienceQuery, [
            getOverallId.rows[0].overAllId,
            element.instituteName,
            element.designation,
            element.department,
            element.address,
            element.fromDate,
            element.toDate,
            values.createdAt,
            values.createdBy,
          ]);
        });
      }

      const newUserDomainValue = [
        getOverallId.rows[0].overAllId,
        values.refUserPassword,
        values.hashedPassword,
        values.createdAt,
        values.createdBy,
      ];

      await connection.query(postnewUserDomain, newUserDomainValue);

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

export const getDoctorMapListModels = async (
  hospitalId: any,
  assistantId: any
) => {
  const connection = await DB();

  try {
    const result = await connection.query(getDoctorMapList, [
      assistantId,
      hospitalId,
    ]);

    const userStatus = await connection.query(getUserActiveStatus, [
      assistantId,
    ]);

    console.log(userStatus.rows[0].activeStatus);

    return {
      status: true,
      doctorMapList: result.rows,
      userStatus: userStatus.rows[0]
        ? userStatus.rows[0].activeStatus
        : "noStatus",
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const addAssistantMapModels = async (
  doctorId,
  assistantId,
  createdAt,
  createdBy
) => {
  const connection = await DB();
  try {
    await connection.query(addStaffAssistantMap, [
      doctorId,
      assistantId,
      createdAt,
      createdBy,
    ]);

    return {
      status: true,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const postActiveStatus = async (
  doctorId,
  value,
  updatedAt,
  updatedBy
) => {
  const connection = await DB();

  try {
    await connection.query(postActiveQuery, [
      value,
      updatedAt,
      updatedBy,
      doctorId,
    ]);

    return {
      status: true,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};
