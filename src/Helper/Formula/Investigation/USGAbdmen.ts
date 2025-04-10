export const USGAbdmen = (answers: any, mappedResult: any) => {
  answers.sort((a, b) => a.questionId - b.questionId);

  let kidneyright = "0";
  let krvertical = "";
  let krhorizontal = "";
  let krthickness = "";
  let krpreviousvalue = [];

  let kidneyleft = "0";
  let klvertical = "";
  let klhorizontal = "";
  let klthickness = "";
  let klpreviousvalue = [];

  let echogenicity = "0";
  let echoCurrentVal = "";
  let echoInwhichside = "";
  let echopreviousvalue = [];

  let cortico = "";
  let corticoVal = "";
  let corticoInWhichside = "";
  let corticopreviousvalue = [];

  const currentDate = new Date();
  const isoDate = currentDate.toISOString();

  //Kidney Right
  krvertical = answers.find((element) => element.questionId === 328)
    ? answers.find((element) => element.questionId === 328).answer
    : "";

  krhorizontal = answers.find((element) => element.questionId === 329)
    ? answers.find((element) => element.questionId === 329).answer
    : "";

  krthickness = answers.find((element) => element.questionId === 347)
    ? answers.find((element) => element.questionId === 347).answer
    : "";

  krpreviousvalue.push({
    date: isoDate,
    number: krvertical,
    oneHour: krhorizontal,
    twoHours: krthickness,
    flag: "db",
  });

  if (answers.find((element) => element.questionId === 330)) {
    answers
      .find((element) => element.questionId === 330)
      .answer.forEach((element) => {
        krpreviousvalue.push(element);
      });
  }
  // krpreviousvalue.push(
  //   answers.find((element) => element.questionId === 330)
  //     ?
  //     : null
  // );

  //Kidney Left
  klvertical = answers.find((element) => element.questionId === 334)
    ? answers.find((element) => element.questionId === 334).answer
    : "";

  klhorizontal = answers.find((element) => element.questionId === 335)
    ? answers.find((element) => element.questionId === 335).answer
    : "";

  klthickness = answers.find((element) => element.questionId === 348)
    ? answers.find((element) => element.questionId === 348).answer
    : "";

  klpreviousvalue.push({
    date: isoDate,
    number: klvertical,
    oneHour: klhorizontal,
    twoHours: klthickness,
    flag: "db",
  });

  if (answers.find((element) => element.questionId === 336)) {
    answers
      .find((element) => element.questionId === 336)
      .answer.forEach((element) => {
        klpreviousvalue.push(element);
      });
  }

  // klpreviousvalue.push(
  //   answers.find((element) => element.questionId === 336)
  //     ? answers.find((element) => element.questionId === 336).answer
  //     : null
  // );

  //Echogenicity
  let echoCurrentValans = answers.find((element) => element.questionId === 338)
    ? answers.find((element) => element.questionId === 338)
    : 0;

  echoCurrentVal = mappedResult
    .flat()
    .find(
      (option) => option.refOptionId === echoCurrentValans.answer
    )?.refOptionLabel;

  if (echoCurrentVal === "Increased") {
    let echoInwhichsideans = answers.find(
      (element) => element.questionId === 339
    )
      ? answers.find((element) => element.questionId === 339)
      : 0;

    echoInwhichside =
      mappedResult
        .flat()
        .find((option) => option.refOptionId === echoInwhichsideans.answer)
        ?.refOptionLabel || "";

    echopreviousvalue.push({
      date: isoDate,
      number: echoCurrentVal + " - " + echoInwhichside,
      flag: "db",
    });
  } else {
    echopreviousvalue.push({
      date: isoDate,
      number: echoCurrentVal,
      flag: "db",
    });
  }

  if (answers.find((element) => element.questionId === 340)) {
    answers
      .find((element) => element.questionId === 340)
      .answer.forEach((element) => {
        echopreviousvalue.push(element);
      });
  }

  // echopreviousvalue.push(
  //   answers.find((element) => element.questionId === 340)
  //     ? answers.find((element) => element.questionId === 340).answer
  //     : null
  // );

  // Cortico Medulary Differentiation
  cortico = answers.find((element) => element.questionId === 350)
    ? answers.find((element) => element.questionId === 350).answer
    : 0;

  let corticoValans = answers.find((element) => element.questionId === 342)
    ? answers.find((element) => element.questionId === 342)
    : 0;

  corticoVal = mappedResult
    .flat()
    .find(
      (option) => option.refOptionId === corticoValans.answer
    )?.refOptionLabel;

  if (corticoVal === "Distorted") {
    let corticoInWhichsideans = answers.find(
      (element) => element.questionId === 343
    )
      ? answers.find((element) => element.questionId === 343)
      : 0;

    corticoInWhichside = mappedResult
      .flat()
      .find(
        (option) => option.refOptionId === corticoInWhichsideans.answer
      )?.refOptionLabel;

    corticopreviousvalue.push({
      date: isoDate,
      number: cortico,
      oneHour: corticoVal + " - " + corticoInWhichside,
      flag: "db",
    });
  } else if (corticoVal === "Poorly Differentiated") {
    let corticoInWhichsideans = answers.find(
      (element) => element.questionId === 344
    )
      ? answers.find((element) => element.questionId === 344)
      : 0;

    corticoInWhichside = mappedResult
      .flat()
      .find(
        (option) => option.refOptionId === corticoInWhichsideans.answer
      )?.refOptionLabel;

    corticopreviousvalue.push({
      date: isoDate,
      number: cortico,
      oneHour: corticoVal + " - " + corticoInWhichside,
      flag: "db",
    });
  } else {
    corticopreviousvalue.push({
      date: isoDate,
      number: cortico,
      oneHour: corticoVal,
      flag: "db",
    });
  }

  if (answers.find((element) => element.questionId === 345)) {
    answers
      .find((element) => element.questionId === 345)
      .answer.forEach((element) => {
        corticopreviousvalue.push(element);
      });
  }

  // corticopreviousvalue.push(
  //   answers.find((element) => element.questionId === 345)
  //     ? answers.find((element) => element.questionId === 345).answer
  //     : null
  // );

  console.log(
    kidneyright,
    krvertical,
    krhorizontal,
    krthickness,
    kidneyleft,
    klvertical,
    klhorizontal,
    klthickness,
    echogenicity,
    echoCurrentVal,
    echoInwhichside,
    cortico,
    corticoVal,
    corticoInWhichside
  );

  console.log("$$$$$$$$$$$$$$$", krpreviousvalue);

  console.log("$$$$$$$$$$$$$$$$", klpreviousvalue);

  console.log("$$$$$$$$$$$$$", echopreviousvalue);

  console.log("$$$$$$$$$$$$$$$$", corticopreviousvalue);

  return {
    score: [
      "0",
      kidneyright,
      krvertical,
      krhorizontal,
      krthickness,
      kidneyleft,
      klvertical,
      klhorizontal,
      klthickness,
      echogenicity,
      echoCurrentVal,
      echoInwhichside,
      cortico,
      corticoVal,
      corticoInWhichside,
    ],
    investigationData: [
      krpreviousvalue,
      klpreviousvalue,
      echopreviousvalue,
      corticopreviousvalue,
    ],
    investigationDataCategory: ["225", "228", "231", "234"],
  };
};
