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
            Email: request.body.Email
        }
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.Password, salt);

    const parametersRegister = {
        TableName: process.env.UsersTableName, 
        Item: {
            Email: request.body.Email, 
            Password: hashPassword,
            Answers: {}
        },
        // This makes sure that if Email exists, it will NOT add to database.
        ConditionExpression: "attribute_not_exists(Email)"
    };


    try {
        // Check if Email already exist

        const checkUserExist = await readWriteToDatabase(documentClient, parametersGetUser, 'get');

        // If Email already exists, prevent registration.
        if (Object.keys(checkUserExist).length > 0) {
            console.log(`${parametersGetUser.Key.Email} exists`);
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
