/**
 * Compare the user answers in database vs correct answers.
 * Calculate score: >= 80% is passing.
 * Send result to client.
 *
 * Once user submits a test, client will send user's answers.
 *
 */

export const checkAnswers = (
  userAnswers = [{ id: 100, userAnswer: "I don't know" }],
  correctAnswers = [
    { id: 100, correctAnswer: "Instruction" },
    { id: 101, correctAnswer: "True" },
  ]
) => {
  // userAnswers will be provided in an array of objects with id and correctAnswer.
  // correctAnswers will be provided in an array of objects with id and userAnswer.
  // userAnswers = [{id:100, userAnswer: "I don't know"}];
  // correctAnswer = [{id:100, correctAnswer: "Instruction"}];

  // Filter userAnswers and check if the userAnswer matches with some of the correctAnswer.
  const userCorrectAnswers = userAnswers.filter((userAnswerObject) =>
    correctAnswers.some(
      (correctAnswerObject) =>
      (userAnswerObject.userAnswer).toLocaleLowerCase() === (correctAnswerObject.correctAnswer).toLocaleLowerCase() && userAnswerObject.id === correctAnswerObject.id
    )
  );

  return userCorrectAnswers.length / correctAnswers.length;
};
