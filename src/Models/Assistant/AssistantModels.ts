import { Alcohol } from "../../Helper/Formula/Alcohol";
import { BMI } from "../../Helper/Formula/BMI";
import { Dietary } from "../../Helper/Formula/Dietary";
import { FamilyHistory } from "../../Helper/Formula/FamilyHistory";
import { GCT } from "../../Helper/Formula/Investigation/GCT";
import { SingleValues } from "../../Helper/Formula/Investigation/SingleValues";
import { MenstrualHistory } from "../../Helper/Formula/MenstrualHistory";
import { OGTT } from "../../Helper/Formula/Investigation/OGTT";
import { PhysicalAactivity } from "../../Helper/Formula/PhysicalActivity";
import { PreviousIllness } from "../../Helper/Formula/PreviousIllness";
import { Sleep } from "../../Helper/Formula/Sleep";
import { Stress } from "../../Helper/Formula/Stress";
import { Tabacco } from "../../Helper/Formula/Tobacco";
import { Vitals } from "../../Helper/Formula/Vitals";
const logger = require("../../Helper/Logger");
import {
  addPatientIdTransactionQuery,
  checkAgeQuery,
  checkMobileNumberQuery,
  deleteTreatmentDetailQuery,
  deleteTreatmentDetails,
  diagosisCategory,
  getAssessmentNoQuery,
  getInvestigationDetailsQuery,
  getProfileQueryAssistant,
  getProfileQueryUsers,
  getQuestionScoreQuery,
  insertInvestigationDetails,
  insertTreatmentDetails,
  insertTreatmentDetailsPatientId,
  overAllId,
  postReportParticularDate,
  resetScoreInvestigationDetails,
  updateTreatmentDetails,
} from "./AssistantQuery";
import { SingleSelectValues } from "../../Helper/Formula/Investigation/SingleSelectValue";
import { USGAbdmen } from "../../Helper/Formula/Investigation/USGAbdmen";
import { createReportModel } from "../Doctor/DoctorModel";

import nodemailer from "nodemailer";
import { TC } from "../../Helper/Formula/Investigation/TC";
import { HDLScore } from "../../Helper/Formula/Investigation/HDL";
import {
  checkSubscriptionsQuery,
  InsertSubscriptionQuery,
  SelectPackageQuery,
} from "../Commercial/CommercialQuery";
import { addDaysToDate } from "../../Helper/CurrentTime";

/**
 * Sends a PDF report via email using Nodemailer.
 *
 * @param {string} mailId - Recipient email address.
 * @param {string} pdfBase64 - Base64 encoded PDF file.
 * @param {string} filename - Name of the attached PDF file.
 * @returns {Promise<{status: boolean, message?: string}>}
 * */

const DB = require("../../Helper/DBConncetion");

const {
  getPatientDataQuery,
  nextUserId,
  postNewUser,
  postnewCommunication,
  postnewUserDomain,
  getUserId,
  getMainCategoryQuery,
  getSubMainCategoryQuery,
  getOptions,
  getFirstQuestionQuery,
  getUserScore,
  getPasswordQuery,
  getAssistantDoctorQuery,
  resetScoreQuery,
  postPastReport,
  postCurrentReport,
  reportDetailsQuery,
  questionDetailsQuery,
  resetPatientTransactionQuery,
  getLatestPTIdQuery,
  addPatientTransactionQuery,
  addUserScoreDetailsQuery,
  getResetScoreRefQuery,
  getUserScoreVerifyQuery,
  getProfileQuery,
  getCatgeoryQuery,
  getReportSessionQuery,
} = require("./AssistantQuery");

const { checkPatientMapQuery } = require("../Doctor/DoctorQuery");
const { CurrentTime, getDateOnly } = require("../../Helper/CurrentTime");

export const getPatientDataModels = async (mobileNumber: any) => {
  const connection = await DB();

  try {
    const values = [mobileNumber];

    const result = await connection.query(getPatientDataQuery, values);

    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      CurrentTime(),
      result.rows[0].refUserId,
    ]);

    return {
      status: true,
      packageStatus: checkSubscriptions.rows.length > 0 ? true : false,
      packageData:
        checkSubscriptions.rows.length > 0 ? checkSubscriptions.rows : [],
      data: result.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const postNewPatientModels = async (values: any) => {
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
        "MED" + patientId,
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

      const getuseridVal = await connection.query(getUserId, [
        "MED" + patientId,
      ]);

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

export const getMainCategoryModels = async (
  doctorId: any,
  patientId: any,
  hospitalId: any,
  refLanCode: any
) => {
  const connection = await DB();

  console.log(doctorId);

  try {
    const checkPatient = await connection.query(checkPatientMapQuery, [
      doctorId,
      parseInt(patientId),
      hospitalId,
    ]);

    if (checkPatient.rows.length > 0) {
      const result = await connection.query(getMainCategoryQuery, [refLanCode]);

      return {
        status: true,
        data: result.rows,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getSubMainCategoryModels = async (
  categoryId: any,
  doctorId: any,
  patientId: any
) => {
  const connection = await DB();
  try {
    const values = [categoryId];

    const result = await connection.query(getSubMainCategoryQuery, values);

    let resultArray = [];

    for (const element of result.rows) {
      // console.log(element);
      console.log(element.refQCategoryId, element.refCategoryLabel);

      if (
        element.refQCategoryId === 94 ||
        element.refQCategoryId === 6 ||
        element.refQCategoryId === 5 ||
        element.refQCategoryId === 201
      ) {
        // console.log("+++++++++");

        const score = await connection.query(getUserScore, [
          patientId,
          element.refQCategoryId,
        ]);

        if (score.rows.length > 0) {
          resultArray.push({
            refQCategoryId: score.rows[0].refQCategoryId,
            refPTcreatedDate: score.rows[0].refPTcreatedDate,
          });
        }
      }
    }

    // const getReportSession = await connection.query(getReportSessionQuery, [
    //   patientId,
    // ]);

    // let latestreportDate = null;

    // if (getReportSession.rows.length > 0) {
    //   const todayDate = getDateOnly();

    //   const refPTcreatedDate: string =
    //     getReportSession.rows[0].refPTcreatedDate;

    //   function parseDateOnly(dateStr: string): Date {
    //     // Parse ISO 8601 string directly as a Date object
    //     const date = new Date(dateStr);
    //     return new Date(date.setHours(0, 0, 0, 0)); // Set the time to midnight for date-only comparison
    //   }
    //   // Parse the dates
    //   const today: Date = parseDateOnly(todayDate);
    //   const createdDate: Date = parseDateOnly(refPTcreatedDate);

    //   const diffInMilliseconds: number =
    //     today.getTime() - createdDate.getTime(); // Use getTime() to get the timestamp
    //   const diffInDays: number = diffInMilliseconds / (1000 * 60 * 60 * 24); // Convert to days

    //   latestreportDate = Math.abs(diffInDays);
    // }

    return {
      status: true,
      data: result.rows,
      reportAnswer: resultArray,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getCategoryModels = async (
  categoryId: any,
  patientId: any,
  doctorId: any,
  hospitalId: any,
  refLanCode: any
) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  // const PTcreatedDate = getDateOnly();

  try {
    const values = [categoryId, refLanCode];

    const result = await connection.query(getSubMainCategoryQuery, values);

    let resultArray = [];

    for (const element of result.rows) {
      const score = await connection.query(getUserScore, [
        patientId,
        element.refQCategoryId,
        // hospitalId,
        // doctorId,
      ]);
      // PTcreatedDate,

      const UserScoreVerify = await connection.query(getUserScoreVerifyQuery, [
        element.refQCategoryId, refLanCode
      ]);

      resultArray.push({
        refQCategoryId: element.refQCategoryId,
        UserScoreVerify: UserScoreVerify.rows,
        refCategoryLabel: element.refCategoryLabel,
        refScore: score.rows.length > 0 ? score.rows[0].refPTScore : null,
        refScoreId: score.rows.length > 0 ? score.rows[0].refPTId : null,
        refPTcreatedDate:
          score.rows.length > 0 ? score.rows[0].refPTcreatedDate : null,
      });
    }

    const isHigherQuestion = await connection.query(getAssessmentNoQuery, [
      patientId, ['9', '10', '11', '43']
    ]);

    const isLowerQuestion = await connection.query(getAssessmentNoQuery, [
      patientId, ['8', '12', '13', '51']
    ]);

    const checkSubscriptions = await connection.query(checkSubscriptionsQuery, [
      createdAt,
      patientId
    ]);

    return {
      status: true,
      data: resultArray,
      isHigherQuestion: isHigherQuestion.rows,
      isLowerQuestion: isLowerQuestion.rows,
      checkSubscriptions: checkSubscriptions.rows
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getQuestionsModels = async (
  patientId: any,
  questionId: any,
  userid: any,
  refLanCode: any
) => {
  const connection = await DB();


  try {
    const getQuestion = await connection.query(getFirstQuestionQuery, [
      questionId, refLanCode
    ]);

    const mappedResult = await Promise.all(
      getQuestion.rows.map(async (question) => {
        // Parse options specific to the current question
        const optionsValue = question.refOptions.split(",").map(Number);

        // Fetch options for the current question
        const optionResult = await connection.query(getOptions, [optionsValue, refLanCode]);

        return {
          questionId: question.refQId,
          questionText: question.refQuestion,
          questionType: question.refOptionType,
          options: optionResult.rows, // Specific options for this question
        };
      })
    );

    return {
      status: true,
      questions: mappedResult,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

const insertInvestigationPreviousValues = async (
  result: any,
  createdBy: any,
  patientId: any,
  categoryId: any
) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  const PTcreatedDate = getDateOnly();

  result.investigationData.map(async (element) => {
    if (element.flag === "ui" || element.flag === "db") {
      await connection.query(insertInvestigationDetails, [
        createdAt,
        createdBy,
        element.flag === "ui" ? "temp" : element.flag === "db" ? "perm" : null,
        PTcreatedDate,
        element.date,
        element.number,
        element.oneHour ? element.oneHour : "",
        element.twoHours ? element.twoHours : "",
        patientId,
        element.categoryId ? element.categoryId : categoryId,
      ]);
    }
  });
};

export const postAnswersModels = async (
  patientId: any,
  categoryId: any,
  answers: any,
  doctorId: any,
  createdBy: any,
  hospitalId: any,
  refLanCode: any
) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  const PTcreatedDate = getDateOnly();

  try {
    await connection.query("BEGIN;");

    const getQuestion = await connection.query(getFirstQuestionQuery, [
      categoryId,
      refLanCode
    ]);

    const mappedResult: any = await Promise.all(
      getQuestion.rows.map(async (question) => {
        const optionsValue = question.refOptions.split(",").map(Number);

        const optionResult = await connection.query(getOptions, [optionsValue, refLanCode]);

        return optionResult.rows;
      })
    );

    const map = await connection.query(checkPatientMapQuery, [
      doctorId,
      patientId,
      hospitalId,
    ]);

    // console.log("+++++++++++++++++", map.rows[0].refPMId);
    const mapId = hospitalId !== "undefined" ? map.rows[0].refPMId : patientId;

    // console.log("---------->", patientId);

    let score = [];
    let multiCategoryId = [];

    const ageQuery = await connection.query(checkAgeQuery, [patientId]);

    if (categoryId === "8") {
      score = PhysicalAactivity(answers);
      multiCategoryId = ["8", "15", "16", "17", "19", "20", "21"];
    } else if (categoryId === "9") {
      score = Stress(answers, mappedResult);
      multiCategoryId = ["9", "25", "26", "27", "28"];
    } else if (categoryId === "10") {
      score = Tabacco(answers);
      multiCategoryId = [
        "10",
        "33",
        "34",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "239",
      ];
    } else if (categoryId === "11") {
      score = Alcohol(answers, mappedResult);
      multiCategoryId = ["11", "29", "30", "31", "32"];
    } else if (categoryId === "12") {
      score = Dietary(answers, mappedResult);
      multiCategoryId = [
        "12",
        "66",
        "67",
        "68",
        "69",
        "70",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "78",
        "79",
        "80",
        "81",
        "82",
        "83",
      ];
    } else if (categoryId === "13") {
      score = BMI(answers);
      multiCategoryId = ["13", "22", "23", "24"];
    } else if (categoryId === "43") {
      score = Sleep(answers, mappedResult);
      multiCategoryId = ["43", "44", "45", "46", "47", "48", "49", "50"];
    } else if (categoryId === "51") {
      score = FamilyHistory(answers, mappedResult);
      multiCategoryId = ["51", "52", "53", "54", "55", "56", "57", "58"];
    } else if (categoryId === "5") {
      score = MenstrualHistory(answers, mappedResult);
      multiCategoryId = ["5", "59", "60", "61", "62", "63", "64", "65"];
    } else if (categoryId === "6") {
      score = Vitals(answers, mappedResult);
      multiCategoryId = [
        "6",
        "84",
        "85",
        "86",
        "87",
        "88",
        "89",
        "90",
        "91",
        "92",
        "93",
      ];
    } else if (categoryId === "94") {
      score = PreviousIllness(answers, ageQuery.rows[0].refDOB);
      multiCategoryId = [
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177",
        "178",
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "195",
        "196",
        "197",
        "198",
        "199",
        "200",
      ];
    } else if (categoryId === "201") {
      answers.forEach(async (element) => {
        if (!element.id) {
          if (hospitalId !== "undefined") {
            await connection.query(insertTreatmentDetails, [
              mapId,
              element.nameOfMedicine,
              element.category,
              element.strength,
              element.roa,
              element.relationToFood,
              element.morningdosage,
              element.morningtime,
              element.afternoondosage,
              element.afternoontime,
              element.eveningdosage,
              element.eveningtime,
              element.nightdosage,
              element.nighttime,
              element.monthsduration,
              element.yearsduration,
              PTcreatedDate,
              createdAt,
              createdBy,
            ]);
          } else {
            await connection.query(insertTreatmentDetailsPatientId, [
              patientId,
              element.nameOfMedicine,
              element.category,
              element.strength,
              element.roa,
              element.relationToFood,
              element.morningdosage,
              element.morningtime,
              element.afternoondosage,
              element.afternoontime,
              element.eveningdosage,
              element.eveningtime,
              element.nightdosage,
              element.nighttime,
              element.monthsduration,
              element.yearsduration,
              PTcreatedDate,
              createdAt,
              createdBy,
            ]);
          }
        } else {
          await connection.query(updateTreatmentDetails, [
            element.nameOfMedicine,
            element.category,
            element.strength,
            element.roa,
            element.relationToFood,
            element.morningdosage,
            element.morningtime,
            element.afternoondosage,
            element.afternoontime,
            element.eveningdosage,
            element.eveningtime,
            element.nightdosage,
            element.nighttime,
            element.monthsduration,
            element.yearsduration,
            createdAt,
            hospitalId !== "undefined" ? createdBy : patientId,
            element.id,
          ]);
        }
      });

      // score = [0];
      // multiCategoryId = ["201"];
    } else if (categoryId === "202") {
      let result = SingleValues(answers, 269, 268);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["202"];
    } else if (categoryId === "203") {
      let result = SingleValues(answers, 272, 271);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["203"];
    } else if (categoryId === "204") {
      let result = SingleValues(answers, 275, 274);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["204"];
    } else if (categoryId === "205") {
      let result = OGTT(answers);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["205", "208", "209"];
    } else if (categoryId === "206") {
      let result = GCT(answers);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["206", "210"];
    } else if (categoryId === "207") {
      let result = SingleValues(answers, 289, 288);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["207"];
    } else if (categoryId === "213") {
      const HDL = await connection.query(diagosisCategory, [
        getDateOnly(),
        patientId,
        "215",
      ]);

      let result = TC(
        answers,
        292,
        291,
        HDL.rows[0] ? HDL.rows[0].refPTScore : null
      );

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      let multicat = ["213"];

      if (HDL) {
        multicat.push("217");
      }

      score = result.score;
      multiCategoryId = multicat;
    } else if (categoryId === "214") {
      let result = SingleValues(answers, 295, 294);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["214"];
    } else if (categoryId === "215") {
      const TC = await connection.query(diagosisCategory, [
        getDateOnly(),
        patientId,
        "213",
      ]);

      let result = HDLScore(
        answers,
        298,
        297,
        TC.rows[0] ? TC.rows[0].refPTScore : null
      );

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      let multicat = ["215"];

      if (TC) {
        multicat.push("217");
      }

      score = result.score;
      multiCategoryId = multicat;
    } else if (categoryId === "216") {
      let result = SingleValues(answers, 302, 301);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["216"];
    } else if (categoryId === "217") {
      let result = SingleValues(answers, 306, 305);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["217"];
    } else if (categoryId === "218") {
      let result = SingleValues(answers, 309, 308);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["218"];
    } else if (categoryId === "219") {
      let result = SingleValues(answers, 312, 311);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["219"];
    } else if (categoryId === "220") {
      let result = SingleValues(answers, 315, 314);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["220"];
    } else if (categoryId === "221") {
      let result = SingleSelectValues(answers, mappedResult, 318, 317);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["221"];
    } else if (categoryId === "222") {
      let result = SingleSelectValues(answers, mappedResult, 321, 320);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["222"];
    } else if (categoryId === "223") {
      let result = SingleSelectValues(answers, mappedResult, 324, 323);

      insertInvestigationPreviousValues(
        result,
        createdBy,
        patientId,
        categoryId
      );

      score = result.score;
      multiCategoryId = ["223"];
    } else if (categoryId === "224") {
      let result: any = USGAbdmen(answers, mappedResult);

      result.investigationDataCategory.forEach((cat, index) => {
        if (result.investigationData[index].length > 0) {
          insertInvestigationPreviousValues(
            { investigationData: result.investigationData[index] },
            createdBy,
            patientId,
            cat
          );
        }
      });

      score = result.score;
      multiCategoryId = [
        "224",
        "225",
        "226",
        "227",
        "240",
        "228",
        "229",
        "230",
        "241",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
      ];
    }

    const getlatestPTId = await connection.query(getLatestPTIdQuery);

    let lastestPTId = 1;

    if (getlatestPTId.rows.length > 0) {
      lastestPTId = parseInt(getlatestPTId.rows[0].refPTId) + 1;
    }

    await Promise.all(
      score.map(async (element, index) => {
        console.log(lastestPTId + index, element, multiCategoryId[index]);

        if (hospitalId !== "undefined") {
          await connection.query(addPatientTransactionQuery, [
            lastestPTId + index,
            mapId,
            element,
            "1",
            PTcreatedDate,
            createdAt,
            createdBy,
          ]);
        } else {
          await connection.query(addPatientIdTransactionQuery, [
            lastestPTId + index,
            patientId,
            element,
            "1",
            PTcreatedDate,
            createdAt,
            patientId,
          ]);
        }

        await connection.query(addUserScoreDetailsQuery, [
          lastestPTId + index,
          multiCategoryId[index],
          createdAt,
          createdBy,
        ]);
      })
    );

    return {
      status: true,
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

export const postFamilyUserModel = async (values: any) => {
  const connection = await DB();
  const createdAt = CurrentTime();

  try {
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

      // const getuseridVal = await connection.query(getUserId, ["MED" + patientId]);

      const newrefCommunicationValue = [
        getOverallId.rows[0].overAllId,
        values.refUserMobileno,
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
        hashedPassword,
        createdAt,
        values.doctorId,
      ];

      await connection.query(postnewUserDomain, newUserDomainValue);

      await connection.query(InsertSubscriptionQuery, [
        checkSubscriptions.rows[0].refPkgId,
        getOverallId.rows[0].overAllId,
        checkSubscriptions.rows[0].refPkgStartDate,
        checkSubscriptions.rows[0].refPkgEndDate,
        createdAt,
        values.refUserId,
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
  } catch (error) {
    await connection.query("ROLLBACK;");
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.query("COMMIT;");
    await connection.end();
  }
};

export const getAssistantDoctorModel = async (
  assistantId: any,
  hospitalId: any
) => {
  const connection = await DB();
  try {
    console.log("====================================");
    console.log(assistantId);
    console.log("====================================");

    const result = await connection.query(getAssistantDoctorQuery, [
      assistantId,
      hospitalId,
    ]);

    return {
      status: true,
      data: result.rows,
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

export const resetScoreModel = async (
  refPatientId: any,
  refQCategoryId: any,
  refHospitalId: any,
  doctorId: any
) => {
  const connection = await DB();
  try {
    await connection.query("BEGIN;");

    const PTcreatedDate = getDateOnly();

    let multiCategoryId = [];

    console.log(refQCategoryId);

    if (refQCategoryId === 8) {
      multiCategoryId = ["8", "15", "16", "17", "19", "20", "21"];
    } else if (refQCategoryId === 13) {
      multiCategoryId = ["13", "22", "23", "24"];
    } else if (refQCategoryId === 9) {
      multiCategoryId = ["9", "25", "26", "27", "28"];
    } else if (refQCategoryId === 10) {
      multiCategoryId = [
        "10",
        "33",
        "34",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
      ];
    } else if (refQCategoryId === 11) {
      multiCategoryId = ["11", "29", "30", "31", "32"];
    } else if (refQCategoryId === 12) {
      multiCategoryId = [
        "12",
        "66",
        "67",
        "68",
        "69",
        "70",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "78",
        "79",
        "80",
        "81",
        "82",
        "83",
      ];
    } else if (refQCategoryId === 43) {
      multiCategoryId = ["43", "44", "45", "46", "47", "48", "49", "50"];
    } else if (refQCategoryId === 51) {
      multiCategoryId = ["51", "52", "53", "54", "55", "56", "57", "58"];
    } else if (refQCategoryId === 5) {
      multiCategoryId = ["5", "59", "60", "61", "62", "63", "64", "65"];
    } else if (refQCategoryId === 6) {
      multiCategoryId = [
        "6",
        "84",
        "85",
        "86",
        "87",
        "88",
        "89",
        "90",
        "91",
        "92",
        "93",
      ];
    } else if (refQCategoryId === 94) {
      multiCategoryId = [
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177",
        "178",
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "195",
        "196",
        "197",
        "198",
        "199",
        "200",
      ];
    } else if (refQCategoryId === 201) {
      multiCategoryId = ["201"];
      await connection.query(deleteTreatmentDetails, [
        refPatientId,
        doctorId,
        PTcreatedDate,
      ]);
    } else if (refQCategoryId === 202) {
      multiCategoryId = ["202"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 203) {
      multiCategoryId = ["203"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 204) {
      multiCategoryId = ["204"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 205) {
      multiCategoryId = ["205", "208", "209"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 206) {
      multiCategoryId = ["206", "210"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 207) {
      multiCategoryId = ["207"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 213) {
      multiCategoryId = ["213"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 214) {
      multiCategoryId = ["214"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 215) {
      multiCategoryId = ["215"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 216) {
      multiCategoryId = ["216"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 217) {
      multiCategoryId = ["217"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 218) {
      multiCategoryId = ["218"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 219) {
      multiCategoryId = ["219"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 220) {
      multiCategoryId = ["220"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 221) {
      multiCategoryId = ["221"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 222) {
      multiCategoryId = ["222"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 223) {
      multiCategoryId = ["223"];
      await connection.query(resetScoreInvestigationDetails, [refQCategoryId]);
    } else if (refQCategoryId === 224) {
      multiCategoryId = [
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
      ];
      await connection.query(resetScoreInvestigationDetails, [330]);
      await connection.query(resetScoreInvestigationDetails, [336]);
      await connection.query(resetScoreInvestigationDetails, [340]);
      await connection.query(resetScoreInvestigationDetails, [330]);
    }

    await Promise.all(
      multiCategoryId.map(async (element) => {
        const refScore = await connection.query(getResetScoreRefQuery, [
          refPatientId,
          doctorId,
          refHospitalId,
          element,
          PTcreatedDate,
        ]);

        await connection.query(resetScoreQuery, [refScore.rows[0].refUSDId]);
        await connection.query(resetPatientTransactionQuery, [
          refScore.rows[0].refPTId,
        ]);
      })
    );

    return {
      status: true,
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

export const postPastReportModel = async (patientId: any) => {
  const connection = await DB();

  const PTcreatedDate = getDateOnly();

  try {
    const values = [patientId];

    const result = await connection.query(postPastReport, values);

    let finalResult = [];

    for (const element of result.rows) {
      try {
        console.log(element);

        // Await the query to ensure it completes before moving on
        const particularDate = await connection.query(
          postReportParticularDate,
          [
            element.refptcreateddate.split("-")[0],
            element.refptcreateddate.split("-")[1],
            patientId,
          ]
        );

        // const partDate = [];

        // let refPMID;

        // if (particularDate.rows.length > 0) {
        //   let checkval = particularDate.rows[0].refQCategoryId;

        //   refPMID = particularDate.rows[0].refPMId;

        //   particularDate.rows.map((particular) => {
        //     console.log(particular);

        //     if (particular.refQCategoryId === checkval)
        //       partDate.push(particular.refptcreateddate);
        //   });
        // }

        // partDate.sort((a, b) => Number(a) - Number(b));

        finalResult.push({
          refptcreateddate: element.refptcreateddate,
          multipleDate: particularDate.rows,
          refPMId: particularDate.rows[0].refPMID,
        });
      } catch (error) {
        console.error("Error executing query:", error);
      }
    }

    // console.log("##############");

    // console.log(refPMID);
    // console.log("##############");

    return {
      status: true,
      data: finalResult,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const postCurrentReportModels = async (
  doctorId: any,
  patientId: any,
  patientGender: any,
  hospitalId: any
) => {
  const connection = await DB();

  const PTcreatedDate = getDateOnly();

  try {
    const result = await connection.query(postCurrentReport, [
      hospitalId,
      doctorId,
      patientId,
      PTcreatedDate,
    ]);

    let categoryId = "";
    let categoryLabel = "";

    let mainId = "";
    let mainLabel = "";

    let isCategoryZeroAvailable = result.rows.some(
      (row) => row.refQCategoryId === "0"
    );

    if (result.rows.length === 0) {
      isCategoryZeroAvailable = true;
    }

    if (!isCategoryZeroAvailable) {
      const validCategory = [
        "8",
        "9",
        "10",
        "11",
        "13",
        "43",
        "51",
        "12",
        "94",
        "201",
      ];

      if (patientGender === "female") {
        validCategory.push("5");
        validCategory.push("6");
      } else {
        validCategory.push("6");
      }

      for (const element of validCategory) {
        if (!result.rows.some((row: any) => row.refQCategoryId === element)) {
          isCategoryZeroAvailable = false;
          categoryId = element;
          const result = await connection.query(getCatgeoryQuery, [element]);
          categoryLabel = result.rows[0].refCategoryLabel;

          const mainresult = await connection.query(getCatgeoryQuery, [
            result.rows[0].refQSubCategory,
          ]);
          mainId = mainresult.rows[0].refQCategoryId;
          mainLabel = mainresult.rows[0].refCategoryLabel;
          break;
        } else {
          isCategoryZeroAvailable = "report";
        }
      }
    }

    return {
      status: true,
      currentCatgoryStatus: isCategoryZeroAvailable,
      categoryId: categoryId,
      categoryLabel: categoryLabel,
      mainId: mainId,
      mainLabel: mainLabel,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getPastReportModels = async (scoreId: any) => {
  const connection = await DB();

  try {
    const reportDetails = await connection.query(reportDetailsQuery, [scoreId]);

    const questionDetails = await connection.query(questionDetailsQuery, [
      reportDetails.rows[0].createdAt,
      reportDetails.rows[0].refUserId,
    ]);

    return {
      status: true,
      reportDetails: reportDetails.rows[0],
      questionDetails: questionDetails.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getUserScoreVerifyModel = async (categoryId: any) => {
  const connection = await DB();

  try {
    const result = await connection.query(getUserScoreVerifyQuery, [
      categoryId,
    ]);

    console.log(categoryId, result.rows);

    return {
      status: true,
      scoreVerify: result.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getProfileModel = async (
  userId: any,
  hospitalId: any,
  roleId: any
) => {
  const connection = await DB();

  console.log("-->--", userId, roleId);

  try {
    if (roleId === 3) {
      console.log("Hello");

      const getProfileUser = await connection.query(getProfileQueryUsers, [
        userId,
      ]);

      return {
        status: true,
        data: getProfileUser.rows[0],
      };

      // const resultPatient = await connection
    } else {
      const resultDoctor = await connection.query(getProfileQuery, [
        userId,
        hospitalId,
      ]);

      if (resultDoctor.rows[0]) {
        return {
          status: true,
          data: resultDoctor.rows[0],
        };
      } else {
        const resultAssistant = await connection.query(
          getProfileQueryAssistant,
          [userId, hospitalId]
        );

        console.log(resultAssistant.rows);

        if (resultAssistant.rows[0]) {
          return {
            status: true,
            data: resultAssistant.rows[0],
          };
        }
      }
    }
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getQuestionScoreModel = async (
  patientId: any,
  categoryId: any
) => {
  const connection = await DB();
  const PTcreatedDate = getDateOnly();

  try {
    const result = await connection.query(getQuestionScoreQuery, [
      patientId,
      categoryId,
      PTcreatedDate,
    ]);

    return {
      status: result.rows.length > 0 ? true : false,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getInvestigationDetailsModel = async (
  patientId: any,
  categoryId: any
) => {
  const connection = await DB();
  try {
    const result = await connection.query(getInvestigationDetailsQuery, [
      patientId,
      categoryId,
    ]);

    return {
      status: true,
      data: result.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const deleteInvestigationDetailModel = async (investigationId: any) => {
  const connection = await DB();
  try {
    await connection.query(deleteTreatmentDetailQuery, [investigationId]);

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

export const sendReportMailModel = async (
  mailId: string,
  pdfBase64: string,
  filename: string,
  name: string
): Promise<{ status: boolean; message?: string }> => {
  try {
    // Validate input
    if (!mailId || !pdfBase64 || !filename || !name) {
      return { status: false, message: "Missing required parameters" };
    }

    // Convert Base64 to Buffer
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mailId,
      subject: name + " HealthCare Report",
      html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Health Report Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 3px solid #ffffff;
        }
        .header {
            background-color: #ffffff;
            padding: 0px 20px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: white;
        }
        .company-name span {
            color: #f3dc00;
        }
        .header img {
            max-height: 50px;
        }
        .content {
            padding: 20px;
            text-align: left;
            color: #333333;
        }
        .signature {
            text-align: left;
            font-weight: bold;
            margin-top: 20px;
            color: #0478df;
        }
        .footer {
            background-color: #0478df;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">

<img src="https://i.ibb.co/twxfhn82/logo-2.png"  />
                   </div>
        <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thanks from <strong>ZAdroit</strong>, please find attached your Health report for self-care recommendation.</p>
            <p class="signature">
                Thanks & Regards, <br>
                ZAdroit Team
            </p>
        </div>
        <div class="footer">
            &copy; 2025 ZAdroit. All rights reserved.
        </div>
    </div>

</body>
</html>`,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent successfully to ${mailId}`);

    return { status: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { status: false, message: "Failed to send email" };
  }
};

const htmlbody = () => { };
