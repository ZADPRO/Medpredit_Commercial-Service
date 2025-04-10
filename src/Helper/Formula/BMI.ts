export const BMI = (answers: any) => {
  answers.sort((a, b) => a.questionId - b.questionId);

  const height = parseFloat(answers[0].answer);
  const weight = parseFloat(answers[1].answer);
  const waistcircumference = parseFloat(answers[2].answer);
  const hipcircumference = parseFloat(answers[3].answer);

  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(2);

  const ratio = (waistcircumference / hipcircumference).toFixed(2);

  return [bmi, height, weight, ratio];
};
