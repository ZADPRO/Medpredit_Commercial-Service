export const SingleSelectValues = (
  answers: any,
  mappedResult: any,
  previousValue: any,
  currentValue: any
) => {
  const data = answers.find((item) => item.questionId === previousValue);
  let value = Array.isArray(data.answer) ? data.answer : [];

  let answer = answers.find((item) => item.questionId === currentValue).answer;

  const currentDate = new Date();
  const isoDate = currentDate.toISOString();

  value.push({
    date: isoDate,
    number: mappedResult.flat().find((option) => option.refOptionId === answer)
      ?.refOptionLabel,
    flag: "db",
  });

  return {
    score: [
      mappedResult.flat().find((option) => option.refOptionId === answer)
        ?.refOptionLabel,
    ],
    investigationData: value,
  };
};
