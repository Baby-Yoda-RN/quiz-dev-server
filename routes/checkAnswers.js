import express from "express";
import AWS from "aws-sdk";
import jwt_decode from "jwt-decode";
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";
import { checkAnswers } from "../utilities/checkAnswers.js";
import { delayTime } from "../constants/index.js";

export const routerCheckAnswers = express.Router();

// The client make a post request to '/checkanswers', allowing for checking answers.
routerCheckAnswers.post("/checkanswers", async (request, response) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  console.log(request.headers);

  try {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayTime);

    const userAnswersId = request.body.userAnswers
      .map((object) => object.id)
      .sort((a, b) => a - b);

    const [firstId, lastId] = [
      userAnswersId[0],
      userAnswersId[userAnswersId.length - 1],
    ];

    /************************************************************************/
    // Check if user from token exists
    /************************************************************************/

    const token = request.headers.authorization;

    const decoded = jwt_decode(token);

    const {
      data: { email: email },
    } = decoded;

    const parametersGetUser = {
      TableName: process.env.UsersTableName,
      Key: {
        email: email,
      },
    };

    // Check if email already exist
    const checkUserExist = await readWriteToDatabase(
      documentClient,
      parametersGetUser,
      "get"
    );

    /************************************************************************/
    // Get questions from database
    /************************************************************************/
    const parametersGetQuestions = {
      TableName: process.env.QuestionTableName,
      FilterExpression: "#id between :firstId and :lastId",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":firstId": firstId,
        ":lastId": lastId,
      },
    };

    const allQuestions = await readWriteToDatabase(
      documentClient,
      parametersGetQuestions,
      "scan"
    );

    /************************************************************************/
    // Calculate score
    /************************************************************************/

    const sortedAllQuestions = allQuestions.Items.sort(
      (firstItem, secondItem) => firstItem.id - secondItem.id
    );

    // Check for correct answers
    const score = checkAnswers(
      request.body.userAnswers,
      sortedAllQuestions
    ).toString();

    const scorePercent = (score * 100).toString() + "%";

    /************************************************************************/
    // Save scores to datbase
    /************************************************************************/
    const testId = sortedAllQuestions[0].testId;

    // If email exists
    if (Object.keys(checkUserExist).length > 0) {
      const parametersAddScorer = {
        TableName: process.env.UsersTableName,
        Key: {
          email: email,
        },
        UpdateExpression: "set Scores = :scores",
        ExpressionAttributeValues:{
          ":scores": {...checkUserExist.Item.Scores, [testId]: scorePercent}
        },
        ReturnValues:"UPDATED_NEW"
      };

      await readWriteToDatabase(documentClient, parametersAddScorer, "update");
    }

    // send response to client
    response.status(200).send(score);
  } catch (error) {
    response.status(400).send(error);
  }
});
