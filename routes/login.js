import express from "express";
import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { readWriteToDatabase } from "../models/readWriteToDatabase.js";
import { delayTime } from "../constants/index.js";

export const routerLogin = express.Router();

// The client make a post request to '/register', allowing a new account to be created (add) to database.
routerLogin.post("/login", async (request, response) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  // Check if user exists in database, if not create account else send error message
  const parametersGetUser = {
    TableName: process.env.UsersTableName,
    Key: {
      email: request.body.email,
    },
  };



  try {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayTime);

    // Check if email already exist
    const checkUserExist = await readWriteToDatabase(
      documentClient,
      parametersGetUser,
      "get"
    );

    // If email exists
    if (Object.keys(checkUserExist).length > 0) {
      console.log(`${parametersGetUser.Key.email} exists`);

      console.log(checkUserExist);

      // If the hash password from database is same as hash password from request body, then login is valid.
      if (
        await bcrypt.compare(
          request.body.Password,
          checkUserExist.Item.Password
        )
      ) {
        //Create and assign a token
        const token = jwt.sign(
          {
            data: {
              email: request.body.email,
              name: checkUserExist.Item.name,
              image: checkUserExist.Item.image,
              answers: checkUserExist.Item.answers,
              scores: checkUserExist.Item.scores,
            },
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 86400, //expires in 24 hours
          }
        );
        response.send(token);
      } else {
        response.send("Wrong email or Password.");
      }
    } else {
      response.send("Wrong email or Password.");
    }
  } catch (error) {
    response.status(400).send(error);
  }
});
