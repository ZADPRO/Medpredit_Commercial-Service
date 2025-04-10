export const Hypertension = (
  scoreResult: any,
  hypertensiontreatmentDetails: any,
  treatmentDetails: any,
  age: any
) => {
  let systemicHypertension = scoreResult.find(
    (item) => item.refQCategoryId === "95"
  )?.refPTScore;
  let sbp = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "90")?.refPTScore
  );
  let dbp = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "91")?.refPTScore
  );
  const PreviousDiabetics = scoreResult.find(
    (item) => item.refQCategoryId === "103"
  )?.refPTScore;
  const fbs = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "203")?.refPTScore
  );
  const ppbs = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "204")?.refPTScore
  );
  const rbs = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "202")?.refPTScore
  );
  const hba1c = parseInt(
    scoreResult.find((item) => item.refQCategoryId === "207")?.refPTScore
  );
  if (age < 60) {
    //No Systemic Hypertension
    if (
      systemicHypertension === "No" &&
      !hypertensiontreatmentDetails &&
      sbp < 120 &&
      dbp < 80
    ) {
      return "No Systemic Hypertension";
    }
    //Pre Hypertension
    if ((sbp > 120 && sbp < 130) || (dbp > 80 && dbp < 90)) {
      if (systemicHypertension === "No" && !hypertensiontreatmentDetails) {
        return "Pre Hypertension";
      }
    }
    console.log(scoreResult.find((item) => item.refQCategoryId === "95"));
    console.log(
      "-------------------AGe>",
      age,
      sbp,
      dbp,
      systemicHypertension,
      hypertensiontreatmentDetails
    );
    //Newly Diagnosed Hypertension Stage 1
    if ((sbp > 130 && sbp <= 139) || (dbp >= 80 && dbp <= 89)) {
      if (systemicHypertension === "No" && !hypertensiontreatmentDetails) {
        return "Newly Diagnosed Hypertension Stage 1";
      }
    }
    //Newly Diagnosed Hypertension Stage 2
    if (sbp >= 140 || dbp >= 90) {
      if (systemicHypertension === "No" && !hypertensiontreatmentDetails) {
        return "Newly Diagnosed Hypertension Stage 2";
      }
    }
    //Known Systemic Hypertension Controlled With Medication
    if (
      systemicHypertension === "Yes" &&
      hypertensiontreatmentDetails &&
      sbp < 140 &&
      dbp < 90
    ) {
      return "Known Systemic Hypertension Controlled With Medication";
    }
    //Known Systemic Hypertension Uncontrolled With Medication
    if (
      systemicHypertension === "Yes" &&
      hypertensiontreatmentDetails &&
      sbp > 140 &&
      dbp > 90
    ) {
      return "Known Systemic Hypertension Uncontrolled With Medication";
    }
    console.log("----------sbp", sbp, dbp);
    //Known Systemic Hypertension Controlled Without Medication
    if (
      systemicHypertension === "Yes" &&
      !hypertensiontreatmentDetails &&
      sbp < 140 &&
      dbp < 90
    ) {
      return "Known Systemic Hypertension Controlled Without Medication";
    }
    //Known Systemic Hypertension Uncontrolled Without Medication
    if (
      systemicHypertension === "Yes" &&
      !hypertensiontreatmentDetails &&
      sbp > 140 &&
      dbp > 90
    ) {
      return "Known Systemic Hypertension Uncontrolled Without Medication";
    }
    //Newly Diagnosed Systemic Hypertension and Diabetes
    if (sbp > 130 || dbp > 85) {
      if (
        systemicHypertension === "No" &&
        PreviousDiabetics === "No" &&
        !treatmentDetails &&
        !hypertensiontreatmentDetails &&
        fbs > 126 &&
        ppbs > 200 &&
        rbs > 200 &&
        hba1c > 6.5
      ) {
        return "Newly Diagnosed Systemic Hypertension and Diabetes";
      }
    }
    //Newly Diagnosed Systemic Hypertension in Known Diabetes
    if (sbp > 130 || dbp > 85) {
      if (
        systemicHypertension === "No" &&
        PreviousDiabetics === "Yes" &&
        !hypertensiontreatmentDetails
      ) {
        return "Newly Diagnosed Systemic Hypertension in Known Diabetes";
      }
    }
    //Known Hypertension & DM - BP Controlled With Medication
    if (sbp < 130 || dbp < 85) {
      if (
        systemicHypertension === "Yes" &&
        PreviousDiabetics === "Yes" &&
        hypertensiontreatmentDetails
      ) {
        return "Known Hypertension & DM - BP Controlled With Medication";
      }
    }
    //Known Hypertension & DM - BP Uncontrolled With Medication
    if (sbp > 130 || dbp > 85) {
      if (
        systemicHypertension === "Yes" &&
        PreviousDiabetics === "Yes" &&
        hypertensiontreatmentDetails
      ) {
        return "Known Hypertension & DM - BP Uncontrolled With Medication";
      }
    }
    //Known Hypertension & DM - BP Controlled Without Medication
    if (sbp < 130 || dbp < 85) {
      if (
        systemicHypertension === "Yes" &&
        PreviousDiabetics === "Yes" &&
        !hypertensiontreatmentDetails
      ) {
        return "Known Hypertension & DM - BP Controlled Without Medication";
      }
    }
    //Known Hypertension & DM - BP Uncontrolled Without Medication
    if (sbp > 130 || dbp > 85) {
      if (
        systemicHypertension === "Yes" &&
        PreviousDiabetics === "Yes" &&
        !hypertensiontreatmentDetails
      ) {
        return "Known Hypertension & DM - BP Uncontrolled Without Medication";
      }
    }
    //Isolated Systolic Hypertension - Newly Diagnosed
    if (
      sbp > 140 &&
      dbp < 90 &&
      systemicHypertension === "No" &&
      !hypertensiontreatmentDetails
    ) {
      return "Isolated Systolic Hypertension - Newly Diagnosed";
    }
    //Known Isolated Systolic Hypertension - Incontrolled With Medication
    if (
      sbp > 140 &&
      dbp < 89 &&
      systemicHypertension === "Yes" &&
      hypertensiontreatmentDetails
    ) {
      return "Known Isolated Systolic Hypertension - Incontrolled With Medication";
    }
    //Hypertension Crisis
    if (sbp >= 180 && dbp >= 120) {
      return "Hypertension Crisis";
    }
  } else if (age >= 61) {
    //Systemic Hypertension - Newly Diagnosed
    if (
      sbp > 150 &&
      dbp < 90 &&
      systemicHypertension === "No" &&
      !hypertensiontreatmentDetails
    ) {
      return "Systemic Hypertension - Newly Diagnosed";
    }
    //Known Isolated Systemic Hypertension - Uncontrolled with Medication
    if (
      sbp > 150 &&
      dbp < 90 &&
      systemicHypertension === "Yes" &&
      hypertensiontreatmentDetails
    ) {
      return "Known Isolated Systemic Hypertension - Uncontrolled with Medication";
    }
  }
  return "Condition Not Statisfied";
};