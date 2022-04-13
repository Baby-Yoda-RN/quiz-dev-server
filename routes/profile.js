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

    let testScores;
  
    testScores = Object.keys(checkUserExist.Item.scores).map(key => checkUserExist.Item.scores[key])
    
    // If email exists
    if (Object.keys(checkUserExist).length > 0) {
      console.log(`${parametersGetUser.Key.email} exists`);

      console.log(checkUserExist);
      response.status(200).send({
        name: checkUserExist.Item.name,
        email: checkUserExist.Item.email,
        answers: checkUserExist.Item.answers,
        scores: testScores, //checkUserExist.Item.scores,
        image: checkUserExist.Item.image
      });
    } else {
      response.send("Wrong Email or Password.");
    }
  } catch (error) {
    response.status(400).send(error);
  }
});
