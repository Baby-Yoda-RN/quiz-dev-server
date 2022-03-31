import express from "express";
import AWS from "aws-sdk";
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";

export const routerGetQuestions = express.Router();

// The client make a get request to '/getonequestion', requesting one question from database.
routerGetQuestions.get("/getquestions/:category", async (request, response) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const parametersGetAllQuestions = {
    TableName: process.env.QuestionTableName,
    FilterExpression: "#category = :category",
    ExpressionAttributeNames: {
      "#category": "category",
    },
    ExpressionAttributeValues: {
      ":category": request.params.category,
    },
  };

  try {
    const questions = await readWriteToDatabase(
      documentClient,
      parametersGetAllQuestions,
      "scan"
    );

    const sortedQuestions = questions.Items.sort(
      (firstItem, secondItem) => firstItem.id - secondItem.id
    );

    //console.log(sortedQuestions);

    response.send(sortedQuestions);
  } catch (error) {
    response.status(400).send(error);
  }
});
