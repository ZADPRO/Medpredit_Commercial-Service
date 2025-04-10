export const GCT = (answers: any) => {
  const data = answers.find((item) => item.questionId === 286);
  const currentDate = new Date();
  const isoDate = currentDate.toISOString();
  let value = data.answer;

  value.push({
    date: isoDate,
    number: answers.find((item) => item.questionId === 284).answer,
    twoHours: answers.find((item) => item.questionId === 285).answer,
    flag: "db",
  });

  return {
    score: [
      answers.find((item) => item.questionId === 284).answer,
      answers.find((item) => item.questionId === 285).answer,
    ],
    investigationData: value,
  };
};
