import express from "express";
import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";
import { delayTime } from "../constants/index.js";

export const routerProfile = express.Router();

// The client make a post request to '/register', allowing a new account to be created (add) to database.
routerProfile.get("/profile", async (request, response) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  try {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayTime);

    console.log(request.headers.authorization)

    const token = request.headers.authorization;

    const decoded = jwt_decode(token);

    const {
      data: { Email: email },
    } = decoded;

    const parametersGetUser = {
      TableName: process.env.UsersTableName,
      Key: {
        Email: email,
      },
    };

    // Check if Email already exist
    const checkUserExist = await readWriteToDatabase(
      documentClient,
      parametersGetUser,
      "get"
    );

    let testScores;
  
    testScores = Object.keys(checkUserExist.Item.Scores).map(key => checkUserExist.Item.Scores[key])
    
    // If Email exists
    if (Object.keys(checkUserExist).length > 0) {
      console.log(`${parametersGetUser.Key.Email} exists`);

      console.log(checkUserExist);
      response.status(200).send({
        Name: checkUserExist.Item.Name,
        Email: checkUserExist.Item.Email,
        Answers: checkUserExist.Item.Answers,
        Scores: testScores, //checkUserExist.Item.Scores,
        TestStates: checkUserExist.Item.TestStates,
        Image: checkUserExist.Item.Image
      });
    } else {
      response.send("Wrong Email or Password.");
    }
  } catch (error) {
    response.status(400).send(error);
  }
});
