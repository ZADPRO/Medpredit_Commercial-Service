export const Diabetes = (scoreResult: any, treatmentDetails: any) => {
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

  let result = "";

  //No diabetes
  if (
    fbs <= 100 &&
    ppbs <= 140 &&
    rbs <= 110 &&
    hba1c <= 5.7 &&
    PreviousDiabetics != "Yes"
  ) {
    result = "No Diabetes";
    return result;
  }

  //Prediabetes
  if (
    fbs >= 101 &&
    fbs <= 125 &&
    ppbs >= 141 &&
    ppbs <= 199 &&
    hba1c >= 5.8 &&
    hba1c <= 6.4 &&
    PreviousDiabetics != "Yes"
  ) {
    result = "Prediabetes";
    return result;
  }

  if (PreviousDiabetics === "Yes") {
    if (fbs <= 100 && ppbs <= 140 && rbs <= 110 && hba1c <= 5.7) {
      if (treatmentDetails) {
        return "Diabetes Controlled With Medications";
      } else {
        return "Diabetes Controlled Without Medications";
      }
    }
  } else if (fbs >= 126 && ppbs >= 200 && rbs >= 200 && hba1c >= 6.5) {
    if (treatmentDetails) {
      return "Diabetes Uncontrolled With Medications";
    } else {
      return "Diabetes Uncontrolled Without Medications";
    }
  }

  // console.log(PreviousDiabetics, treatmentDetails, fbs, ppbs, rbs, hba1c);

  return "Condition Not Statisfied";
};
