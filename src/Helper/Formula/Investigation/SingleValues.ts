export const SingleValues = (
  answers: any,
  previousValue: any,
  currentValue: any
) => {

  console.log(answers, previousValue, currentValue)

  if (!answers || !Array.isArray(answers)) {
    console.error("Invalid answers array:", answers);
    return { score: [], investigationData: [] };
  }

  const data = answers.find((item) => item.questionId === previousValue);
  if (!data) {
    console.error("No data found for previousValue:", previousValue);
    return { score: [], investigationData: [] };
  }

  const currentAnswer = answers.find(
    (item) => item.questionId === currentValue
  );
  if (!currentAnswer) {
    console.error("No data found for currentValue:", currentValue);
    return { score: [], investigationData: [] };
  }

  const currentDate = new Date();
  const isoDate = currentDate.toISOString();
  let value = Array.isArray(data.answer) ? data.answer : [];

  value.push({
    date: isoDate,
    number: currentAnswer.answer,
    flag: "db",
  });

  return {
    score: [currentAnswer.answer],
    investigationData: value,
  };
};
