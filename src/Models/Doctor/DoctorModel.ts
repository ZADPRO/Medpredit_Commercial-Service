import {
  calculateAge,
  getDateOnly,
  getParticularDateOnly,
} from "../../Helper/CurrentTime";
import { Diabetes } from "../../Helper/Formula/Diagnosis/Diabetes";
import {
  addPatientTransactionQuery,
  addUserScoreDetailsQuery,
  getCurrentInvestigation,
  getLatestPTIdQuery,
  getPastInvestigation,
  getProfileQuery,
  getProfileQueryAssistant,
  getReportTreatmentDetails,
  getTreatmentDetails,
} from "../Assistant/AssistantQuery";
import {
  checkCreateReport,
  deleteTreatmentDetail,
  getAllCategoryFamilyHistory,
  getAllCategoryQuery,
  getAllScoreQuery,
  getAllScoreVerifyQuery,
  getDiagnosisQuery,
  getDiagnosisTreatmentQuery,
  getDoctorData,
  getDoctorDetailsReport,
  getHomeCategory,
  getHomeCategoryAssistant,
  getHomePatient,
  getHomePatientAssistant,
  getParticualarScoreQuery,
  getPatientDetailsReport,
  getScoreReport,
  getScoreVerifyReport,
  getStressAnswerQuery,
  getTreatementDetails,
} from "./DoctorQuery";
import { Hypertension } from "../../Helper/Formula/Diagnosis/Hypertension";
const DB = require("../../Helper/DBConncetion");

const {
  checkPatientMapQuery,
  addPatientMapQuery,
  getDoctorMap,
  getPatientDetail,
  getDoctorPatientMapQuery,
} = require("./DoctorQuery");

const { CurrentTime } = require("../../Helper/CurrentTime");

export const checkPatientMapModel = async (
  doctorId: any,
  patientId: any,
  hospitalId: any
) => {
  const connection = await DB();

  try {
    const values = [doctorId, patientId, hospitalId];

    console.log("--->>>>-----", doctorId, patientId, hospitalId);

    const result = await connection.query(checkPatientMapQuery, values);

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

export const addPatientMapModel = async (
  doctorId: any,
  patientId: any,
  hospitalId: any
) => {
  const connection = await DB();

  try {
    const createdAt = CurrentTime();

    const hospitalID = hospitalId;

    const getDoctorHospitalMap = await connection.query(getDoctorMap, [
      hospitalID,
      doctorId,
    ]);

    console.log(hospitalID, doctorId);

    const values = [
      getDoctorHospitalMap.rows[0].refDMId,
      patientId,
      createdAt,
      doctorId,
    ];

    await connection.query(addPatientMapQuery, values);

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

export const getCurrentReportDataModel = async (
  doctorId: any,
  patientId: any,
  hospitalId: any
) => {
  const connection = await DB();

  const refPTcreatedDate = getDateOnly();

  try {
    const patientIdResult = await connection.query(getPatientDetail, [
      patientId,
    ]);

    const patient = patientIdResult.rows[0];

    const getAllCategoryResult = await connection.query(getAllCategoryQuery);

    const getAllScoreResult = await connection.query(getAllScoreQuery, [
      patientId,
      refPTcreatedDate,
    ]);

    const doctorIdResult = await connection.query(getDoctorData, [
      getAllScoreResult.rows[getAllScoreResult.rows.length - 1].refPMId,
    ]);

    // const doctor = doctorIdResult.rows[0];

    // console.log("------->" + doctor);

    const getAllScoreVerify = await connection.query(getAllScoreVerifyQuery);

    const getStressAnswer = await connection.query(getStressAnswerQuery);

    const TreatmentDetails = await connection.query(getTreatmentDetails, [
      patientId,
    ]);

    const rbs = await connection.query(getCurrentInvestigation, [
      patientId,
      "202",
      refPTcreatedDate,
    ]);

    const fbs = await connection.query(getCurrentInvestigation, [
      patientId,
      "203",
      refPTcreatedDate,
    ]);

    const ppbs = await connection.query(getCurrentInvestigation, [
      patientId,
      "204",
      refPTcreatedDate,
    ]);

    const ogtt = await connection.query(getCurrentInvestigation, [
      patientId,
      "205",
      refPTcreatedDate,
    ]);

    const gct = await connection.query(getCurrentInvestigation, [
      patientId,
      "206",
      refPTcreatedDate,
    ]);

    const hba1c = await connection.query(getCurrentInvestigation, [
      patientId,
      "207",
      refPTcreatedDate,
    ]);

    const fastingcholesterol = await connection.query(getCurrentInvestigation, [
      patientId,
      "213",
      refPTcreatedDate,
    ]);

    const fastingtriglycerides = await connection.query(
      getCurrentInvestigation,
      [patientId, "214", refPTcreatedDate]
    );

    const hdl = await connection.query(getCurrentInvestigation, [
      patientId,
      "215",
      refPTcreatedDate,
    ]);

    const ldl = await connection.query(getCurrentInvestigation, [
      patientId,
      "216",
      refPTcreatedDate,
    ]);

    const tchdl = await connection.query(getCurrentInvestigation, [
      patientId,
      "217",
      refPTcreatedDate,
    ]);

    const kr = await connection.query(getCurrentInvestigation, [
      patientId,
      "225",
      refPTcreatedDate,
    ]);

    const kl = await connection.query(getCurrentInvestigation, [
      patientId,
      "228",
      refPTcreatedDate,
    ]);

    const echo = await connection.query(getCurrentInvestigation, [
      patientId,
      "231",
      refPTcreatedDate,
    ]);

    const cortico = await connection.query(getCurrentInvestigation, [
      patientId,
      "234",
      refPTcreatedDate,
    ]);

    const bloodurea = await connection.query(getCurrentInvestigation, [
      patientId,
      "218",
      refPTcreatedDate,
    ]);

    const serum = await connection.query(getCurrentInvestigation, [
      patientId,
      "219",
      refPTcreatedDate,
    ]);

    const egfr = await connection.query(getCurrentInvestigation, [
      patientId,
      "220",
      refPTcreatedDate,
    ]);

    const urinesugar = await connection.query(getCurrentInvestigation, [
      patientId,
      "221",
      refPTcreatedDate,
    ]);

    const urinealbumin = await connection.query(getCurrentInvestigation, [
      patientId,
      "222",
      refPTcreatedDate,
    ]);

    const urineketones = await connection.query(getCurrentInvestigation, [
      patientId,
      "223",
      refPTcreatedDate,
    ]);

    return {
      // doctorDetail: {
      //   doctorName: doctor.doctorname,
      //   doctorId: doctor.doctorid,
      //   hospital: doctor.hospital,
      //   hospitalAddress: doctor.hospitaladdress + ", " + doctor.hospitalpincode,
      // },
      patientDetail: {
        patientName: patient.refUserFname + " " + patient.refUserLname,
        patientId: patient.refUserCustId,
        gender: patient.refGender,
        age: calculateAge(patient.refDOB),
        address1: patient.refAddress,
        address2: patient.refDistrict + ", " + patient.refPincode,
      },
      allCategory: getAllCategoryResult.rows,
      allScore: getAllScoreResult.rows,
      allScoreVerify: getAllScoreVerify.rows,
      stressAnswer: getStressAnswer.rows,
      treatmentDetails: TreatmentDetails.rows,
      rbs: rbs.rows,
      fbs: fbs.rows,
      ppbs: ppbs.rows,
      ogtt: ogtt.rows,
      gct: gct.rows,
      hba1c: hba1c.rows,
      fastingcholesterol: fastingcholesterol.rows,
      fastingtriglycerides: fastingtriglycerides.rows,
      hdl: hdl.rows,
      ldl: ldl.rows,
      tchdl: tchdl.rows,
      kr: kr.rows,
      kl: kl.rows,
      echo: echo.rows,
      cortico: cortico.rows,
      bloodurea: bloodurea.rows,
      serum: serum.rows,
      egfr: egfr.rows,
      urinesugar: urinesugar.rows,
      urinealbumin: urinealbumin.rows,
      urineketones: urineketones.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const createReportModel = async (
  patientId: any,
  doctorId: any,
  hospitalId: any,
  employee: any
) => {
  const connection = await DB();
  try {
    const refPTcreatedDate = getDateOnly();

    const map = await connection.query(checkPatientMapQuery, [
      doctorId,
      patientId,
      hospitalId,
    ]);

    const mapId = map.rows[0].refPMId;

    const checkCreateReportresult = await connection.query(checkCreateReport, [
      refPTcreatedDate,
      mapId,
      patientId,
    ]);

    if (checkCreateReportresult.rows.length === 0) {
      // Diabetics Diagnosis
      const scoreResult = await connection.query(getDiagnosisQuery, [
        refPTcreatedDate,
        patientId,
      ]);

      const values = [
        "103",
        "203",
        "204",
        "202",
        "207",
        "90",
        "91",
        "52",
        "53",
      ];

      let Status103 = false;
      let Status203 = false;
      let Status204 = false;
      let Status202 = false;
      let Status207 = false;
      let Status90 = false;
      let Status91 = false;
      let Status52 = false;
      let Status53 = false;
      let StatusHyperTreat = false;

      values.map((element) => {
        const foundItem = scoreResult.rows.find(
          (item) => item.refQCategoryId === element
        );

        if (
          foundItem &&
          getValidateDuration(element) >
            -calculateDaysDifference(
              foundItem.refPTcreatedDate,
              refPTcreatedDate
            )
        ) {
          if (element === "103") {
            Status103 = true;
          } else if (element === "203") {
            Status203 = true;
          } else if (element === "204") {
            Status204 = true;
          } else if (element === "202") {
            Status202 = true;
          } else if (element === "207") {
            Status207 = true;
          } else if (element === "90") {
            Status90 = true;
          } else if (element === "91") {
            Status91 = true;
          } else if (element === "52") {
            Status52 = true;
          } else if (element === "53") {
            Status53 = true;
          }
          // Status = true;
        } else {
          if (element === "103") {
            Status103 = false;
          } else if (element === "203") {
            Status203 = false;
          } else if (element === "204") {
            Status204 = false;
          } else if (element === "202") {
            Status202 = false;
          } else if (element === "207") {
            Status207 = false;
          } else if (element === "90") {
            Status90 = false;
          } else if (element === "91") {
            Status91 = false;
          } else if (element === "52") {
            Status52 = false;
          } else if (element === "53") {
            Status53 = false;
          }
          // Status = false;
        }
      });

      if (
        Status103 &&
        Status203 &&
        Status204 &&
        Status202 &&
        Status207 &&
        Status90 &&
        Status91 &&
        Status52 &&
        Status53
      ) {
        const treatmentDetails = await connection.query(
          getDiagnosisTreatmentQuery,
          [refPTcreatedDate, patientId, "Anti-diabetic"]
        );

        const diabetesResult = Diabetes(
          scoreResult.rows,
          treatmentDetails.rows[0].treatementdetails
        );

        // Hypertension Diagnosis
        const hypertensiontreatmentDetails = await connection.query(
          getDiagnosisTreatmentQuery,
          [refPTcreatedDate, patientId, "Anti-hypertensive"]
        );

        if (hypertensiontreatmentDetails.rows.length > 0) {
          StatusHyperTreat = true;
        } else {
          StatusHyperTreat = false;
        }

        if (
          Status103 &&
          Status203 &&
          Status204 &&
          Status202 &&
          Status207 &&
          Status90 &&
          Status91 &&
          Status52 &&
          Status53
        ) {
          const ageQuery = await connection.query(getPatientDetail, [
            patientId,
          ]);

          const age = calculateAge(ageQuery.rows[0].refDOB);

          const hypertensionResult = Hypertension(
            scoreResult.rows,
            hypertensiontreatmentDetails.rows[0].treatementdetails,
            treatmentDetails.rows[0].treatementdetails,
            age
          );

          console.log(diabetesResult, hypertensionResult);

          let score = [diabetesResult, hypertensionResult];
          let multiCategoryId = ["237", "238"];

          const createdAt = CurrentTime();

          const getlatestPTId = await connection.query(getLatestPTIdQuery);

          let lastestPTId = 1;

          if (getlatestPTId.rows.length > 0) {
            lastestPTId = parseInt(getlatestPTId.rows[0].refPTId) + 1;
          }

          let latestval = lastestPTId;

          await Promise.all(
            score.map(async (element, index) => {
              console.log(lastestPTId + index, element, multiCategoryId[index]);

              await connection.query(addPatientTransactionQuery, [
                lastestPTId + index,
                mapId,
                element,
                "1",
                refPTcreatedDate,
                createdAt,
                employee,
              ]);

              await connection.query(addUserScoreDetailsQuery, [
                lastestPTId + index,
                multiCategoryId[index],
                createdAt,
                employee,
              ]);

              latestval += 1;
            })
          );
        }
      }

      // console.log("====================================");
      // console.log(Status);
      // console.log("====================================");
    } else {
      console.log("_+_+_+_+_+_+_+_+_+ Data AlreADY Created");
    }

    console.log(
      "############################",
      checkCreateReportresult.rows.length
    );

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

export const getPastReportDataModel = async (
  patientId: any,
  doctorId: any,
  reportDate: any
) => {
  const connection = await DB();
  try {
    const patientIdResult = await connection.query(getPatientDetail, [
      patientId,
    ]);

    const patient = patientIdResult.rows[0];

    const getAllCategoryResult = await connection.query(getAllCategoryQuery);

    const getAllScoreResult = await connection.query(getParticualarScoreQuery, [
      patientId,
      reportDate,
    ]);

    const doctorIdResult = await connection.query(getDoctorData, [doctorId]);

    const doctor = doctorIdResult.rows[0];

    const getAllScoreVerify = await connection.query(getAllScoreVerifyQuery);

    const getStressAnswer = await connection.query(getStressAnswerQuery);

    const TreatmentDetails = await connection.query(getReportTreatmentDetails, [
      patientId,
    ]);

    const rbs = await connection.query(getPastInvestigation, [
      patientId,
      "202",
      reportDate,
    ]);

    const fbs = await connection.query(getPastInvestigation, [
      patientId,
      "203",
      reportDate,
    ]);

    const ppbs = await connection.query(getPastInvestigation, [
      patientId,
      "204",
      reportDate,
    ]);

    const ogtt = await connection.query(getPastInvestigation, [
      patientId,
      "205",
      reportDate,
    ]);

    const gct = await connection.query(getPastInvestigation, [
      patientId,
      "206",
      reportDate,
    ]);

    const hba1c = await connection.query(getPastInvestigation, [
      patientId,
      "207",
      reportDate,
    ]);

    const fastingcholesterol = await connection.query(getPastInvestigation, [
      patientId,
      "213",
      reportDate,
    ]);

    const fastingtriglycerides = await connection.query(getPastInvestigation, [
      patientId,
      "214",
      reportDate,
    ]);

    const hdl = await connection.query(getPastInvestigation, [
      patientId,
      "215",
      reportDate,
    ]);

    const ldl = await connection.query(getPastInvestigation, [
      patientId,
      "216",
      reportDate,
    ]);

    const tchdl = await connection.query(getPastInvestigation, [
      patientId,
      "217",
      reportDate,
    ]);

    const kr = await connection.query(getPastInvestigation, [
      patientId,
      "225",
      reportDate,
    ]);

    const kl = await connection.query(getPastInvestigation, [
      patientId,
      "228",
      reportDate,
    ]);

    const echo = await connection.query(getPastInvestigation, [
      patientId,
      "231",
      reportDate,
    ]);

    const cortico = await connection.query(getPastInvestigation, [
      patientId,
      "234",
      reportDate,
    ]);

    const bloodurea = await connection.query(getPastInvestigation, [
      patientId,
      "218",
      reportDate,
    ]);

    const serum = await connection.query(getPastInvestigation, [
      patientId,
      "219",
      reportDate,
    ]);

    const egfr = await connection.query(getPastInvestigation, [
      patientId,
      "220",
      reportDate,
    ]);

    const urinesugar = await connection.query(getPastInvestigation, [
      patientId,
      "221",
      reportDate,
    ]);

    const urinealbumin = await connection.query(getPastInvestigation, [
      patientId,
      "222",
      reportDate,
    ]);

    const urineketones = await connection.query(getPastInvestigation, [
      patientId,
      "223",
      reportDate,
    ]);

    return {
      doctorDetail: {
        doctorName: doctor ? doctor.doctorname : "",
        doctorId: doctor ? doctor.doctorid : "",
        hospital: doctor ? doctor.hospital : "",
        hospitalAddress: doctor
          ? doctor.hospitaladdress + ", " + doctor.hospitalpincode
          : "",
      },
      patientDetail: {
        patientName: patient.refUserFname + " " + patient.refUserLname,
        patientId: patient.refUserCustId,
        gender: patient.refGender,
        age: calculateAge(patient.refDOB),
        address1: patient.refAddress,
        address2: patient.refDistrict + ", " + patient.refPincode,
      },
      allCategory: getAllCategoryResult.rows,
      allScore: getAllScoreResult.rows,
      allScoreVerify: getAllScoreVerify.rows,
      stressAnswer: getStressAnswer.rows,
      treatmentDetails: TreatmentDetails.rows,
      rbs: rbs.rows,
      fbs: fbs.rows,
      ppbs: ppbs.rows,
      ogtt: ogtt.rows,
      gct: gct.rows,
      hba1c: hba1c.rows,
      fastingcholesterol: fastingcholesterol.rows,
      fastingtriglycerides: fastingtriglycerides.rows,
      hdl: hdl.rows,
      ldl: ldl.rows,
      tchdl: tchdl.rows,
      kr: kr.rows,
      kl: kl.rows,
      echo: echo.rows,
      cortico: cortico.rows,
      bloodurea: bloodurea.rows,
      serum: serum.rows,
      egfr: egfr.rows,
      urinesugar: urinesugar.rows,
      urinealbumin: urinealbumin.rows,
      urineketones: urineketones.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

const getValidateDuration = (questionId: any) => {
  switch (parseInt(questionId)) {
    case 94:
      return 1;
    case 6:
      return 1;
    case 8:
      return 14;
    case 9:
      return 14;
    case 10:
      return 14;
    case 11:
      return 14;
    case 12:
      return 14;
    case 13:
      return 14;
    case 43:
      return 14;
    case 51:
      return 14;
    case 52:
      return 14;
    case 53:
      return 14;
    case 90:
      return 1;
    case 91:
      return 1;
    case 103:
      return 1;
    case 202:
      return 1;
    case 203:
      return 1;
    case 204:
      return 1;
    case 205:
      return 1;
    case 206:
      return 1;
    case 207:
      return 1;
    case 213:
      return 1;
    case 214:
      return 1;
    case 215:
      return 1;
    case 216:
      return 1;
    case 217:
      return 1;
    case 218:
      return 1;
    case 219:
      return 1;
    case 220:
      return 1;
    case 221:
      return 1;
    case 222:
      return 1;
    case 223:
      return 1;
    case 224:
      return 1;
    case 237:
      return 1;
    case 238:
      return 1;
    case 22:
      return 14;
    case 23:
      return 14;
    case 24:
      return 14;
    default:
      return 0;
  }
};

function calculateDaysDifference(dateString: any, reportDate: any) {
  // Convert the given date string to a Date object
  const givenDate: any = new Date(dateString);

  // Get the current date and set time to midnight for accurate day difference
  const currentDate: any = new Date(reportDate);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const diffInMs = givenDate - currentDate;

  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

export const getCurrentReportPDFModel = async (
  patientId: any,
  reportDate: any,
  doctorId: any
) => {
  const connection = await DB();

  const refPTcreatedDate = getDateOnly();

  const createdAt = CurrentTime();

  console.log("====================================");
  console.log(reportDate, createdAt);
  console.log("====================================");

  try {
    const patientResult = await connection.query(getPatientDetail, [patientId]);

    const scoreResult = await connection.query(getAllScoreQuery, [
      patientId,
      reportDate,
    ]);

    const doctorResult = await connection.query(getDoctorDetailsReport, [
      doctorId,
    ]);

    const scoreVerifyResult = await connection.query(getScoreVerifyReport);

    const categoryResult = await connection.query(getAllCategoryFamilyHistory);

    const treatementDetails = await connection.query(getTreatementDetails, [
      patientId,
    ]);
    console.log("--->--->---.Success", patientResult.rows);

    const groupedData: Record<
      string,
      { category: string; doctorid: number }[]
    > = scoreResult.rows.reduce((acc, row: any) => {
      console.log(row.refQCategoryId);

      if (
        getValidateDuration(row.refQCategoryId) >
        -calculateDaysDifference(row.refPTcreatedDate, reportDate)
      ) {
        if (!acc[row.doctorname]) {
          acc[row.doctorname] = [];
        }
        acc[row.doctorname].push({
          category: row.refCategoryLabel,
          doctorid: row.doctorroleid,
        });
      }

      return acc; // Ensure the accumulator is always returned
    }, {});

    // Convert grouped data into the required string format
    const resultString = Object.entries(groupedData)
      .map(([doctorname, categories]) => {
        const doctorid =
          categories.length > 0 ? categories[0].doctorid : "Unknown"; // Get doctorid from first entry
        const categoryList = categories.map((c) => c.category).join(", ");
        return `[ ${categoryList} - ${doctorname} (${
          doctorid === 1 || doctorid === 4
            ? "Doctor"
            : doctorid === 2
            ? "Assistant"
            : doctorid === 3
            ? "Self"
            : null
        }) ]`;
      })
      .join(", ");

    let totalScoreResult = scoreResult.rows;

    //Diabetics and Hypertension Calculations

    const AlgorithamscoreResult = await connection.query(getDiagnosisQuery, [
      refPTcreatedDate,
      patientId,
    ]);

    // const values = ["103", "203", "204", "202", "207", "90", "91", "52", "53"];

    // let Status103 = false;
    // let Status203 = false;
    // let Status204 = false;
    // let Status202 = false;
    // let Status207 = false;
    // let Status90 = false;
    // let Status91 = false;
    // let Status52 = false;
    // let Status53 = false;

    // values.map((element) => {
    //   const foundItem = AlgorithamscoreResult.rows.find(
    //     (item) => item.refQCategoryId === element
    //   );

    //   if (
    //     foundItem &&
    //     getValidateDuration(element) >
    //       -calculateDaysDifference(foundItem.refPTcreatedDate, refPTcreatedDate)
    //   ) {
    //     console.log("====___>", element, true);
    //     if (element === "103") {
    //       Status103 = true;
    //     } else if (element === "203") {
    //       Status203 = true;
    //     } else if (element === "204") {
    //       Status204 = true;
    //     } else if (element === "202") {
    //       Status202 = true;
    //     } else if (element === "207") {
    //       Status207 = true;
    //     } else if (element === "90") {
    //       Status90 = true;
    //     } else if (element === "91") {
    //       Status91 = true;
    //     } else if (element === "52") {
    //       Status52 = true;
    //     } else if (element === "53") {
    //       Status53 = true;
    //     }
    //     // Status = true;
    //   } else {
    //     if (element === "103") {
    //       Status103 = false;
    //     } else if (element === "203") {
    //       Status203 = false;
    //     } else if (element === "204") {
    //       Status204 = false;
    //     } else if (element === "202") {
    //       Status202 = false;
    //     } else if (element === "207") {
    //       Status207 = false;
    //     } else if (element === "90") {
    //       Status90 = false;
    //     } else if (element === "91") {
    //       Status91 = false;
    //     } else if (element === "52") {
    //       Status52 = false;
    //     } else if (element === "53") {
    //       Status53 = false;
    //     }
    //     console.log("====___>", element, false);
    //     // Status = false;
    //   }
    // });

    // console.log(
    //   Status103,
    //   Status203,
    //   Status204,
    //   Status202,
    //   Status207,
    //   Status90,
    //   Status91,
    //   Status52,
    //   Status53
    // );

    // if (
    //   Status103 &&
    //   Status203 &&
    //   Status204 &&
    //   Status202 &&
    //   Status207 &&
    //   Status90 &&
    //   Status91 &&
    //   Status52 &&
    //   Status53
    // ) {
    const treatmentDetails = await connection.query(
      getDiagnosisTreatmentQuery,
      [refPTcreatedDate, patientId, "Anti-diabetic"]
    );

    const diabetesResult = Diabetes(
      AlgorithamscoreResult.rows,
      treatmentDetails.rows[0].treatementdetails
    );

    // Hypertension Diagnosis
    const hypertensiontreatmentDetails = await connection.query(
      getDiagnosisTreatmentQuery,
      [refPTcreatedDate, patientId, "Anti-hypertensive"]
    );

    const ageQuery = await connection.query(getPatientDetail, [patientId]);

    const age = calculateAge(ageQuery.rows[0].refDOB);

    const hypertensionResult = Hypertension(
      AlgorithamscoreResult.rows,
      hypertensiontreatmentDetails.rows[0].treatementdetails,
      treatmentDetails.rows[0].treatementdetails,
      age
    );

    console.log(diabetesResult, hypertensionResult);

    totalScoreResult.push({
      createdAt: createdAt,
      refCategoryLabel: "Diabetes Diagnosis Algorithm",
      refPTScore: diabetesResult,
      refPTStatus: "1",
      refPTcreatedDate: createdAt,
      refQCategoryId: "237",
    });

    totalScoreResult.push({
      createdAt: createdAt,
      refCategoryLabel: "Hypertension Diagnosis Algorithm",
      refPTScore: hypertensionResult,
      refPTStatus: "1",
      refPTcreatedDate: createdAt,
      refQCategoryId: "238",
    });
    // }

    return {
      status: true,
      doctorDetails: doctorResult.rows[0],
      patientDetails: patientResult.rows[0],
      // scoreResult: scoreResult.rows,
      scoreResult: totalScoreResult,
      scoreVerifyResult: scoreVerifyResult.rows,
      generateDate: createdAt,
      categoryResult: categoryResult.rows,
      treatmentDetails: treatementDetails.rows,
      content: resultString,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getPastReportPDFModel = async (
  patientId: any,
  refPMId: any,
  fromDate: any,
  toDate: any
) => {
  const connection = await DB();

  try {
    const patientResult = await connection.query(getPatientDetail, [patientId]);

    const scoreResult = await await connection.query(getParticualarScoreQuery, [
      patientId,
      fromDate,
      toDate === "0" ? fromDate.slice(0, 7) + "-31" : toDate,
    ]);

    const doctorResult = await connection.query(getDoctorDetailsReport, [
      refPMId,
    ]);

    const scoreVerifyResult = await connection.query(getScoreVerifyReport);

    const categoryResult = await connection.query(getAllCategoryFamilyHistory);

    const treatementDetails = await connection.query(
      getReportTreatmentDetails,
      [
        patientId,
        fromDate,
        toDate === "0" ? fromDate.slice(0, 7) + "-31" : toDate,
      ]
    );

    return {
      status: true,
      doctorDetails: doctorResult.rows[0],
      patientDetails: patientResult.rows[0],
      scoreResult: scoreResult.rows,
      scoreVerifyResult: scoreVerifyResult.rows,
      generateDate: fromDate,
      categoryResult: categoryResult.rows,
      treatmentDetails: treatementDetails.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getHomeScreenModel = async (doctorId: any, hospitalId: any) => {
  const connection = await DB();
  try {
    const createdAt = getDateOnly();

    console.log(createdAt);

    const resultDoctor = await connection.query(getProfileQuery, [
      doctorId,
      hospitalId,
    ]);

    const todayPatient = await connection.query(getHomePatient, [
      doctorId,
      createdAt,
      createdAt,
    ]);

    const yesterdayPatient = await connection.query(getHomePatient, [
      doctorId,
      getParticularDateOnly(1),
      getParticularDateOnly(1),
    ]);

    const lastweekPatient = await connection.query(getHomePatient, [
      doctorId,
      getParticularDateOnly(7),
      getParticularDateOnly(0),
    ]);

    const lastmonth = await connection.query(getHomePatient, [
      doctorId,
      getParticularDateOnly(30),
      getParticularDateOnly(0),
    ]);

    const previousmonth = await connection.query(getHomePatient, [
      doctorId,
      getParticularDateOnly(60),
      getParticularDateOnly(30),
    ]);

    const physicalActivity = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "8",
    ]);

    console.log(doctorId);

    const totalCategory = [];

    let phyRisk = 0;
    let phynorisk = 0;
    let physubrisk = 0;

    physicalActivity.rows.map((element) => {
      if (element.refPTScore === "Risk") {
        phyRisk++;
      } else if (parseInt(element.refPTScore) >= 150) {
        phynorisk++;
      } else if (parseInt(element.refPTScore) < 150) {
        physubrisk++;
      }
    });

    totalCategory.push({
      name: "Physical Activity",
      data: [
        {
          name: "Risk",
          value: phyRisk,
          color: "#f56565",
        },
        {
          name: "No Risk",
          value: phynorisk,
          color: "#4c9a46",
        },
        {
          name: "Substantial Risk",
          value: physubrisk,
          color: "#f8a964",
        },
      ],
    });

    const Sleep = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "43",
    ]);

    let sleepnodiff = 0;
    let sleepmild = 0;
    let sleepmoder = 0;
    let sleepsever = 0;

    Sleep.rows.map((element) => {
      if (element.refPTScore === "0") {
        sleepnodiff++;
      } else if (
        parseInt(element.refPTScore) >= 1 &&
        parseInt(element.refPTScore) <= 7
      ) {
        sleepmild++;
      } else if (
        parseInt(element.refPTScore) >= 8 &&
        parseInt(element.refPTScore) <= 14
      ) {
        sleepmoder++;
      } else if (
        parseInt(element.refPTScore) >= 15 &&
        parseInt(element.refPTScore) <= 21
      ) {
        sleepsever++;
      }
    });

    totalCategory.push({
      name: "Sleep",
      data: [
        {
          name: "No difficulty",
          value: sleepnodiff,
          color: "#4c9a46",
        },
        {
          name: "Mild sleeping difficulty",
          value: sleepmild,
          color: "#f8a964",
        },
        {
          name: "Moderate sleeping difficulty",
          value: sleepmoder,
          color: "#fb7750",
        },
        {
          name: "Severe sleeping difficulty",
          value: sleepsever,
          color: "#f56565",
        },
      ],
    });

    const tobacco = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "10",
    ]);

    let tobaccoRisk = 0;
    let tobacconoRisk = 0;

    tobacco.rows.map((element) => {
      if (element.refPTScore === "Risk") {
        tobaccoRisk++;
      } else if (element.refPTScore === "No Risk") {
        tobacconoRisk++;
      }
    });

    totalCategory.push({
      name: "Tobacco",
      data: [
        {
          name: "Risk",
          value: tobaccoRisk,
          color: "#f56565",
        },
        {
          name: "No Risk",
          value: tobacconoRisk,
          color: "#4c9a46",
        },
      ],
    });

    const alcohol = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "11",
    ]);

    let alcoholnot = 0;
    let alcoholz1 = 0;
    let alcoholz2 = 0;
    let alcoholz3 = 0;
    let alcoholz4 = 0;

    alcohol.rows.map((element) => {
      if (parseInt(element.refPTScore) === 0) {
        alcoholnot++;
      } else if (
        parseInt(element.refPTScore) >= 1 &&
        parseInt(element.refPTScore) <= 7
      ) {
        alcoholz1++;
      } else if (
        parseInt(element.refPTScore) >= 8 &&
        parseInt(element.refPTScore) <= 15
      ) {
        alcoholz2++;
      } else if (
        parseInt(element.refPTScore) >= 16 &&
        parseInt(element.refPTScore) <= 19
      ) {
        alcoholz3++;
      } else if (
        parseInt(element.refPTScore) >= 20 &&
        parseInt(element.refPTScore) <= 40
      ) {
        alcoholz4++;
      }
    });

    totalCategory.push({
      name: "Alcohol",
      data: [
        {
          name: "Not an Alcoholic",
          value: alcoholnot,
          color: "#4c9a46",
        },
        {
          name: "Zone 1",
          value: alcoholz1,
          color: "#f8a964",
        },
        {
          name: "Zone 2",
          value: alcoholz2,
          color: "#fb7750",
        },
        {
          name: "Zone 3",
          value: alcoholz3,
          color: "#fb7750",
        },
        {
          name: "Zone 4",
          value: alcoholz4,
          color: "#f56565",
        },
      ],
    });

    const Dietary = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "12",
    ]);

    let dietnorisk = 0;
    let dietlowrisk = 0;
    let dietmodrisk = 0;
    let diethighrisk = 0;

    Dietary.rows.map((element) => {
      if (parseInt(element.refPTScore) === 0) {
        dietnorisk++;
      } else if (parseInt(element.refPTScore) === 1) {
        dietlowrisk++;
      } else if (parseInt(element.refPTScore) === 2) {
        dietmodrisk++;
      } else if (parseInt(element.refPTScore) === 3) {
        diethighrisk++;
      }
    });

    totalCategory.push({
      name: "Dietary",
      data: [
        {
          name: "No Risk",
          value: dietnorisk,
          color: "#4c9a46",
        },
        {
          name: "Low Risk",
          value: dietlowrisk,
          color: "#f8a964",
        },
        {
          name: "Moderate Risk",
          value: dietmodrisk,
          color: "#fb7750",
        },
        {
          name: "High Risk",
          value: diethighrisk,
          color: "#f56565",
        },
      ],
    });

    const BMI = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "13",
    ]);

    let bmiunderweight = 0;
    let bminormal = 0;
    let bmioverweight = 0;
    let bmiobese = 0;

    BMI.rows.map((element) => {
      if (parseInt(element.refPTScore) <= 18.5) {
        bmiunderweight++;
      } else if (
        parseInt(element.refPTScore) >= 18.5 &&
        parseInt(element.refPTScore) <= 22.9
      ) {
        bminormal++;
      } else if (
        parseInt(element.refPTScore) >= 23 &&
        parseInt(element.refPTScore) <= 25.9
      ) {
        bmioverweight++;
      } else if (parseInt(element.refPTScore) >= 26) {
        bmiobese++;
      }
    });

    totalCategory.push({
      name: "BMI",
      data: [
        {
          name: "Underweight",
          value: bmiunderweight,
          color: "#fb7750",
        },
        {
          name: "Normal BMI",
          value: bminormal,
          color: "#4c9a46",
        },
        {
          name: "Overweight",
          value: bmioverweight,
          color: "#f8a964",
        },
        {
          name: "Obese",
          value: bmiobese,
          color: "#f56565",
        },
      ],
    });

    const Stress = await connection.query(getHomeCategory, [
      doctorId,
      createdAt,
      createdAt,
      "9",
    ]);

    let stresslow = 0;
    let stressmod = 0;
    let stressHigh = 0;

    Stress.rows.map((element) => {
      if (parseInt(element.refPTScore) <= 13) {
        stresslow++;
      } else if (
        parseInt(element.refPTScore) >= 14 &&
        parseInt(element.refPTScore) <= 26
      ) {
        stressmod++;
      } else if (parseInt(element.refPTScore) >= 27) {
        stressHigh++;
      }
    });

    totalCategory.push({
      name: "Stress",
      data: [
        {
          name: "Low Stress",
          value: stresslow,
          color: "#f8a964",
        },
        {
          name: "Moderate Stress",
          value: stressmod,
          color: "#fb7750",
        },
        {
          name: "High Perceived Stress",
          value: stressHigh,
          color: "#f56565",
        },
      ],
    });

    return {
      status: true,
      todayPatient: todayPatient.rows.length,
      yesterdayPatient: yesterdayPatient.rows.length,
      lastweekPatient: lastweekPatient.rows.length,
      lastmonth: lastmonth.rows.length,
      previousmonth: previousmonth.rows.length,
      totalCategory: totalCategory,
      profileName: resultDoctor.rows[0],
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getHomeScreenAssistantModel = async (
  doctorId: any,
  hospitalId: any
) => {
  const connection = await DB();
  try {
    const createdAt = getDateOnly();

    const resultDoctor = await connection.query(getProfileQueryAssistant, [
      doctorId,
      hospitalId,
    ]);

    const todayPatient = await connection.query(getHomePatientAssistant, [
      doctorId,
      createdAt,
      createdAt,
    ]);

    const yesterdayPatient = await connection.query(getHomePatientAssistant, [
      doctorId,
      getParticularDateOnly(1),
      getParticularDateOnly(1),
    ]);

    const lastweekPatient = await connection.query(getHomePatientAssistant, [
      doctorId,
      getParticularDateOnly(7),
      getParticularDateOnly(0),
    ]);

    const lastmonth = await connection.query(getHomePatientAssistant, [
      doctorId,
      getParticularDateOnly(30),
      getParticularDateOnly(0),
    ]);

    const previousmonth = await connection.query(getHomePatientAssistant, [
      doctorId,
      getParticularDateOnly(60),
      getParticularDateOnly(30),
    ]);

    const physicalActivity = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "8",
    ]);

    const totalCategory = [];

    let phyRisk = 0;
    let phynorisk = 0;
    let physubrisk = 0;

    physicalActivity.rows.map((element) => {
      if (element.refPTScore === "Risk") {
        phyRisk++;
      } else if (parseInt(element.refPTScore) >= 150) {
        phynorisk++;
      } else if (parseInt(element.refPTScore) < 150) {
        physubrisk++;
      }
    });

    totalCategory.push({
      name: "Physical Activity",
      data: [
        {
          name: "Risk",
          value: phyRisk,
          color: "#f56565",
        },
        {
          name: "No Risk",
          value: phynorisk,
          color: "#4c9a46",
        },
        {
          name: "Substantial Risk",
          value: physubrisk,
          color: "#f8a964",
        },
      ],
    });

    const Sleep = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "43",
    ]);

    let sleepnodiff = 0;
    let sleepmild = 0;
    let sleepmoder = 0;
    let sleepsever = 0;

    Sleep.rows.map((element) => {
      if (element.refPTScore === "0") {
        sleepnodiff++;
      } else if (
        parseInt(element.refPTScore) >= 1 &&
        parseInt(element.refPTScore) <= 7
      ) {
        sleepmild++;
      } else if (
        parseInt(element.refPTScore) >= 8 &&
        parseInt(element.refPTScore) <= 14
      ) {
        sleepmoder++;
      } else if (
        parseInt(element.refPTScore) >= 15 &&
        parseInt(element.refPTScore) <= 21
      ) {
        sleepsever++;
      }
    });

    totalCategory.push({
      name: "Sleep",
      data: [
        {
          name: "No difficulty",
          value: sleepnodiff,
          color: "#4c9a46",
        },
        {
          name: "Mild sleeping difficulty",
          value: sleepmild,
          color: "#f8a964",
        },
        {
          name: "Moderate sleeping difficulty",
          value: sleepmoder,
          color: "#fb7750",
        },
        {
          name: "Severe sleeping difficulty",
          value: sleepsever,
          color: "#f56565",
        },
      ],
    });

    const tobacco = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "10",
    ]);

    let tobaccoRisk = 0;
    let tobacconoRisk = 0;

    tobacco.rows.map((element) => {
      if (element.refPTScore === "Risk") {
        tobaccoRisk++;
      } else if (element.refPTScore === "No Risk") {
        tobacconoRisk++;
      }
    });

    totalCategory.push({
      name: "Tobacco",
      data: [
        {
          name: "Risk",
          value: tobaccoRisk,
          color: "#f56565",
        },
        {
          name: "No Risk",
          value: tobacconoRisk,
          color: "#4c9a46",
        },
      ],
    });

    const alcohol = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "11",
    ]);

    let alcoholnot = 0;
    let alcoholz1 = 0;
    let alcoholz2 = 0;
    let alcoholz3 = 0;
    let alcoholz4 = 0;

    alcohol.rows.map((element) => {
      if (parseInt(element.refPTScore) === 0) {
        alcoholnot++;
      } else if (
        parseInt(element.refPTScore) >= 1 &&
        parseInt(element.refPTScore) <= 7
      ) {
        alcoholz1++;
      } else if (
        parseInt(element.refPTScore) >= 8 &&
        parseInt(element.refPTScore) <= 15
      ) {
        alcoholz2++;
      } else if (
        parseInt(element.refPTScore) >= 16 &&
        parseInt(element.refPTScore) <= 19
      ) {
        alcoholz3++;
      } else if (
        parseInt(element.refPTScore) >= 20 &&
        parseInt(element.refPTScore) <= 40
      ) {
        alcoholz4++;
      }
    });

    totalCategory.push({
      name: "Alcohol",
      data: [
        {
          name: "Not an Alcoholic",
          value: alcoholnot,
          color: "#4c9a46",
        },
        {
          name: "Zone 1",
          value: alcoholz1,
          color: "#f8a964",
        },
        {
          name: "Zone 2",
          value: alcoholz2,
          color: "#fb7750",
        },
        {
          name: "Zone 3",
          value: alcoholz3,
          color: "#fb7750",
        },
        {
          name: "Zone 4",
          value: alcoholz4,
          color: "#f56565",
        },
      ],
    });

    const Dietary = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "12",
    ]);

    let dietnorisk = 0;
    let dietlowrisk = 0;
    let dietmodrisk = 0;
    let diethighrisk = 0;

    Dietary.rows.map((element) => {
      if (parseInt(element.refPTScore) === 0) {
        dietnorisk++;
      } else if (parseInt(element.refPTScore) === 1) {
        dietlowrisk++;
      } else if (parseInt(element.refPTScore) === 2) {
        dietmodrisk++;
      } else if (parseInt(element.refPTScore) === 3) {
        diethighrisk++;
      }
    });

    totalCategory.push({
      name: "Dietary",
      data: [
        {
          name: "No Risk",
          value: dietnorisk,
          color: "#4c9a46",
        },
        {
          name: "Low Risk",
          value: dietlowrisk,
          color: "#f8a964",
        },
        {
          name: "Moderate Risk",
          value: dietmodrisk,
          color: "#fb7750",
        },
        {
          name: "High Risk",
          value: diethighrisk,
          color: "#f56565",
        },
      ],
    });

    const BMI = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "13",
    ]);

    let bmiunderweight = 0;
    let bminormal = 0;
    let bmioverweight = 0;
    let bmiobese = 0;

    BMI.rows.map((element) => {
      if (parseInt(element.refPTScore) <= 18.5) {
        bmiunderweight++;
      } else if (
        parseInt(element.refPTScore) >= 18.5 &&
        parseInt(element.refPTScore) <= 22.9
      ) {
        bminormal++;
      } else if (
        parseInt(element.refPTScore) >= 23 &&
        parseInt(element.refPTScore) <= 25.9
      ) {
        bmioverweight++;
      } else if (parseInt(element.refPTScore) >= 26) {
        bmiobese++;
      }
    });

    totalCategory.push({
      name: "BMI",
      data: [
        {
          name: "Underweight",
          value: bmiunderweight,
          color: "#fb7750",
        },
        {
          name: "Normal BMI",
          value: bminormal,
          color: "#4c9a46",
        },
        {
          name: "Overweight",
          value: bmioverweight,
          color: "#f8a964",
        },
        {
          name: "Obese",
          value: bmiobese,
          color: "#f56565",
        },
      ],
    });

    const Stress = await connection.query(getHomeCategoryAssistant, [
      doctorId,
      createdAt,
      createdAt,
      "9",
    ]);

    let stresslow = 0;
    let stressmod = 0;
    let stressHigh = 0;

    Stress.rows.map((element) => {
      if (parseInt(element.refPTScore) <= 13) {
        stresslow++;
      } else if (
        parseInt(element.refPTScore) >= 14 &&
        parseInt(element.refPTScore) <= 26
      ) {
        stressmod++;
      } else if (parseInt(element.refPTScore) >= 27) {
        stressHigh++;
      }
    });

    totalCategory.push({
      name: "Stress",
      data: [
        {
          name: "Low Stress",
          value: stresslow,
          color: "#f8a964",
        },
        {
          name: "Moderate Stress",
          value: stressmod,
          color: "#fb7750",
        },
        {
          name: "High Perceived Stress",
          value: stressHigh,
          color: "#f56565",
        },
      ],
    });

    return {
      status: true,
      todayPatient: todayPatient.rows.length,
      yesterdayPatient: yesterdayPatient.rows.length,
      lastweekPatient: lastweekPatient.rows.length,
      lastmonth: lastmonth.rows.length,
      previousmonth: previousmonth.rows.length,
      totalCategory: totalCategory,
      profileName: resultDoctor.rows[0],
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getTreatmentDetailsModel = async (patientId: any) => {
  const connection = await DB();
  try {
    const treatementDetails = await connection.query(getTreatementDetails, [
      patientId,
    ]);

    return {
      status: true,
      treatementDetails: treatementDetails.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const deleteTreatmentDetailModel = async (id: any) => {
  const connection = await DB();
  try {
    await connection.query(deleteTreatmentDetail, [id]);

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
