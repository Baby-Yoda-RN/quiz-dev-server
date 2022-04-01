import express from "express";
import AWS from "aws-sdk";
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";
import { checkAnswers } from "../utilities/checkAnswers.js";

export const routerCheckAnswers = express.Router();

// The client make a post request to '/checkanswers', allowing for checking answers.
routerCheckAnswers.post("/checkanswers", async (request, response) => {

  const userAnswersId = request.body.userAnswers
    .map((object) => object.id)
    .sort((a, b) => a - b);

  const [firstId, lastId] = [
    userAnswersId[0],
    userAnswersId[userAnswersId.length - 1],
  ];

  const documentClient = new AWS.DynamoDB.DocumentClient();

  // Check if user exists in database, if not create account else send error message
  const parametersGetQuestions = {
    TableName: process.env.QuestionTableName,
    FilterExpression: "#id between :firstId and :lastId",
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
        ":firstId": firstId,
        ":lastId": lastId,
    }
  };

  try {
    const allTests = await readWriteToDatabase(
      documentClient,
      parametersGetQuestions,
      "scan"
    );

    const sortedAllTests = allTests.Items.sort(
      (firstItem, secondItem) => firstItem.id - secondItem.id
    );

    // Check for correct answers
    const score = checkAnswers(request.body.userAnswers, sortedAllTests).toString();

    response.status(200).send(score);
  } catch (error) {
    response.status(400).send(error);
  }
});
