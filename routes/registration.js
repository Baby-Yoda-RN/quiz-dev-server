import express from 'express';
import AWS from 'aws-sdk';
import bcrypt from "bcryptjs";
import { registerValidation } from '../validation/validate.js';
import { readWriteToDatabase } from '../models/readWriteToDatabase.js';
import { delayTime } from "../constants/index.js";

export const routerRegister = express.Router();

// The client make a post request to '/register', allowing a new account to be created (add) to database.
routerRegister.post('/register', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // request body should include at least email and password

    // Validate data
    try {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(delayTime);

        const validateResult = registerValidation(request.body);
        if (validateResult !== 'Everything Okay') {
            console.log(validateResult);
            return response.status(400).send(validateResult);
        }
    } catch (error) {
        console.log(error);
        response.status(400).send(error);
    }

    // Check if user exists in database, if not create account else send error message
    const parametersGetUser = {
        TableName: process.env.UsersTableName, 
        Key: {
            email: request.body.email
        }
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.Password, salt);

    const parametersRegister = {
        TableName: process.env.UsersTableName, 
        Item: {
            email: request.body.email, 
            Password: hashPassword,
            Image: "https://react-native-baby-yoda-profile-images.s3.us-west-2.amazonaws.com/unknown.png",
            Answers: {"0": 0},
            Scores: {"0": 0}
        },
        // This makes sure that if email exists, it will NOT add to database.
        ConditionExpression: "attribute_not_exists(email)"
    };


    try {
        // Check if email already exist

        const checkUserExist = await readWriteToDatabase(documentClient, parametersGetUser, 'get');

        // If email already exists, prevent registration.
        if (Object.keys(checkUserExist).length > 0) {
            console.log(`${parametersGetUser.Key.email} exists`);
            response.send('Email already exist');
        }

        // Only register if user doesn't exist
        else {
            try {
                readWriteToDatabase(documentClient, parametersRegister, 'put');
                response.send('Successfully Added User');
            } catch (error) {
                response.status(400).send(error);
            }
        }

    } catch (error) {
        response.status(400).send(error);
    }

});
