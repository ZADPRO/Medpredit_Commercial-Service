export const TC = (
  answers: any,
  previousValue: any,
  currentValue: any,
  hdlval: any
) => {
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

  const score = [];

  score.push(currentAnswer.answer);

  value.push({
    date: isoDate,
    number: currentAnswer.answer,
    flag: "db",
  });

  if (hdlval) {
    value.push({
      date: isoDate,
      categoryId: "217",
      number: (parseFloat(currentAnswer.answer) / parseFloat(hdlval)).toFixed(
        2
      ),
      flag: "db",
    });

    score.push(
      (parseFloat(currentAnswer.answer) / parseFloat(hdlval)).toFixed(2)
    );
  }

  return {
    score: score,
    investigationData: value,
  };
};
