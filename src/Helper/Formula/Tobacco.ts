export const Tabacco = (answers: any) => {
  let tobacco = "Risk";
  let smokingtobacco = "";
  let smokelesstobaccouse = "";
  let home = "";
  let workplace = "";
  let attitudetoward = "";
  let packyear: any = 0;
  let riskpackyear = "";
  let riskpastsmoking = "No Risk";
  let highrisksmokeless = "No Risk";
  let durationofsmokeless = "No Usage";

  const q1 = answers.find((element) => element.questionId === 56)
    ? answers.find((element) => element.questionId === 56).answer
    : 0;
  const q2 = answers.find((element) => element.questionId === 57)
    ? answers.find((element) => element.questionId === 57).answer
    : 0;
  const q3 = answers.find((element) => element.questionId === 58)
    ? answers.find((element) => element.questionId === 58).answer
    : 0;
  const q4 = answers.find((element) => element.questionId === 59)
    ? answers.find((element) => element.questionId === 59)
    : 0;
  const q5 = answers.find((element) => element.questionId === 62)
    ? answers.find((element) => element.questionId === 62).answer
    : 0;
  const q6 = answers.find((element) => element.questionId === 63)
    ? answers.find((element) => element.questionId === 63).answer
    : 0;
  const q7 = answers.find((element) => element.questionId === 64)
    ? answers.find((element) => element.questionId === 64).answer
    : 0;
  const q8 = answers.find((element) => element.questionId === 65)
    ? answers.find((element) => element.questionId === 65).answer
    : 0;
  const q9 = answers.find((element) => element.questionId === 66)
    ? answers.find((element) => element.questionId === 66).answer
    : 0;
  const q10 = answers.find((element) => element.questionId === 67)
    ? answers.find((element) => element.questionId === 67).answer
    : 0;
  const q11 = answers.find((element) => element.questionId === 68)
    ? answers.find((element) => element.questionId === 68).answer
    : 0;
  const q12 = answers.find((element) => element.questionId === 69)
    ? answers.find((element) => element.questionId === 69).answer
    : 0;
  const q13 = answers.find((element) => element.questionId === 70)
    ? answers.find((element) => element.questionId === 70).answer
    : 0;

  const q14 = answers.find((element) => element.questionId === 73)
    ? answers.find((element) => element.questionId === 73).answer
    : 0;
  const q15 = answers.find((element) => element.questionId === 74)
    ? answers.find((element) => element.questionId === 74).answer
    : 0;
  const q16 = answers.find((element) => element.questionId === 75)
    ? answers.find((element) => element.questionId === 75).answer
    : 0;
  const q17 = answers.find((element) => element.questionId === 76)
    ? answers.find((element) => element.questionId === 76).answer
    : 0;

  //Calculate Smoking Tobacco
  if (q1 === 195) {
    smokingtobacco = "Current smoker"; //Current smoker
  }

  if (q2 === 197) {
    smokingtobacco = "Habitual current  smoker"; //Habitual current  smoker
    highrisksmokeless = "Yes";
  }

  if (q1 === 196 && q7 === 214) {
    smokingtobacco = "Past smoker"; //Past smoker
  }

  if (q8 === 216) {
    smokingtobacco = "Habitual past smoker"; //Habitual past smoker
  }

  if (q1 === 196 && q7 === 215 && q16 === 238 && q17 === 240) {
    smokingtobacco = "Non smoker"; // non smoker
    tobacco = "No Risk";
  }

  //Calculate Smokeless Tobacco Uage
  if (q10 === 219) {
    smokelesstobaccouse = "Current user";
  }

  if (q11 === 221) {
    smokelesstobaccouse = "Habitual current  user";
  }

  if (q10 === 220 && q14 === 233) {
    smokelesstobaccouse = "Past user";
  }

  if (q15 === 235) {
    smokelesstobaccouse = "Habitual past smoker";
  }

  if (q10 === 220 && q14 === 234) {
    smokelesstobaccouse = "Non user";
  }

  //Passive Smoking

  //Home
  if (q16) {
    if (q16 === 237) {
      home = "At Risk";
    } else if (q16 === 238) {
      home = "Not a Risk";
    }
  }

  //WorkPlace
  if (q17) {
    if (q17 === 239) {
      workplace = "At Risk";
    } else if (q17 === 240) {
      workplace = "Not a Risk";
    }
  }

  // Attitude towards
  if (q5 === 209) attitudetoward = "Willing to quit";
  if (q6 === 211) attitudetoward = "Adviced to quit";
  if (q5 === 210) attitudetoward = "Not Willing to quit";
  if (q6 === 213) attitudetoward = "Not Adviced to quit";

  //   Calculate Pack Years
  if (q3 && q2) {
    const a = parseInt(q3); // Ensure proper radix for parseInt
    let b = 0;
    let tempb = 0;
    q4.answer.map((element) => {
      tempb += parseFloat(element.days);
    });

    // Calculate b based on q2
    if (q2 === 197) {
      b = tempb;
    } else if (q2 === 198) {
      b = tempb / 7;
    }

    // Calculate packyear
    packyear = ((a * b) / 20).toFixed(2);

    // Determine risk level
    if (isNaN(packyear) || packyear === 0.0) {
      riskpackyear = "No Risk";
    } else if (packyear > 0.01 && packyear <= 0.99) {
      riskpackyear = "Low Risk";
    } else if (packyear > 1.0 && packyear <= 5.0) {
      riskpackyear = "Moderate Risk";
    } else if (packyear > 5.01) {
      riskpackyear = "Severe Risk";
    }
  }

  //Calculate Risk of Past Smoking

  if (q7 === 214) riskpastsmoking = "High risk of past smoking";
  if (q9) {
    let c = (parseInt(q9) / 52).toFixed(2);

    if (parseFloat(c) < 5.0) {
      riskpastsmoking = "High risk of past smoking";
    } else if (parseFloat(c) >= 5.01 && parseFloat(c) <= 10.0) {
      riskpastsmoking = "Moderate risk of past smoking";
    } else if (parseFloat(c) >= 10.01) {
      riskpastsmoking = "Low risk of past smoking";
    }
  }

  // Calculate High risk of smokeless tobacoo
  if (q11 === 221) highrisksmokeless = "High Risk";

  let tempsmokelessuse = 0;
  if (q13) {
    q13.map((element) => {
      tempsmokelessuse += parseInt(element.days);
    });
  }

  if (tempsmokelessuse >= 1) highrisksmokeless = "High Risk";

  //Calculate Duration of smokeless Tobacco
  if (parseFloat(q12) > 0.0 && parseFloat(q12) <= 0.25) {
    durationofsmokeless = "Immediate";
  } else if (parseFloat(q12) > 0.25 && parseFloat(q12) <= 1.0) {
    durationofsmokeless = "Short-Term";
  } else if (parseFloat(q12) > 1.01 && parseFloat(q12) <= 5.0) {
    durationofsmokeless = "Medium-Term";
  } else if (parseFloat(q12) > 5.01 && parseFloat(q12) <= 10.0) {
    durationofsmokeless = "Long-Term";
  } else if (parseFloat(q12) > 10.01) {
    durationofsmokeless = "Veteran";
  }

  return [
    tobacco,
    smokingtobacco,
    smokelesstobaccouse,
    home,
    workplace,
    attitudetoward,
    packyear,
    riskpackyear,
    riskpastsmoking,
    highrisksmokeless,
    durationofsmokeless,
  ];
};
