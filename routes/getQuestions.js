import express from "express";
import AWS from "aws-sdk";
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";
import { delayTime } from "../constants/index.js";

export const routerGetQuestions = express.Router();

// The client make a get request to '/getonequestion', requesting one question from database.
routerGetQuestions.get(
  "/getquestions/:category?",
  async (request, response) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    console.log(request.params);

    // Only reponds with certain category because all category will return error
    const parametersGetQuestions = {
      TableName: process.env.QuestionTableName,
      FilterExpression: "#category = :category or #testId = :testId",
      ExpressionAttributeNames: {
        "#category": "category",
        "#testId": "testId",
      },
      ExpressionAttributeValues: {
        ":category": request.params.category,
        ":testId":
          (!!Number(request.params.category) ||
            request.params.category == "0") &&
          Number(request.params.category),
      },
    };

    const unescapeHTML = (str) =>
      str.replace(
        /&amp;|&lt;|&gt;|&#39;|&#039;|&quot;|&deg;|&ograve;/g,
        (tag) =>
          ({
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&#39;": "'",
            "&#039;": "'",
            "&quot;": '"',
            "&deg;": "°",
            "&ograve;": "ò"
          }[tag] || tag)
      );

    try {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(delayTime);

      const questions = await readWriteToDatabase(
        documentClient,
        parametersGetQuestions,
        "scan"
      );

      const sortedQuestions = questions.Items.sort(
        (firstItem, secondItem) => firstItem.id - secondItem.id
      );

      const unescapeHTMLQuestions = sortedQuestions.map((object) => ({
        ...object,
       "question": unescapeHTML(object.question),
      }));

      //console.log(unescapeHTMLQuestions);

      response.send(unescapeHTMLQuestions);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);
