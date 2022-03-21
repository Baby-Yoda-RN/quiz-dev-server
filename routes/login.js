import express from 'express';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({path: '../.env'});
import { readWriteToDatabase } from '../models/readWriteToDatabase.js';

export const routerLogin = express.Router();

// The client make a post request to '/register', allowing a new account to be created (add) to database.
routerLogin.post('/login', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // Check if user exists in database, if not create account else send error message
    const parametersGetUser = {
        TableName: request.body.TableName, 
        Key: {
            Username: request.body.Username,
        }
    };


    try {
        // Check if Username already exist
        const checkUserExist = await readWriteToDatabase(documentClient, parametersGetUser, 'get');

        // If Username exists
        if (Object.keys(checkUserExist).length > 0) {
            console.log(`${parametersGetUser.Key.Username} exists`);

            // If the hash password from database is same as hash password from request body, then login is valid.
            if(checkUserExist.Item.Password === request.body.Password){
                //Create and assign a token
                const token = jwt.sign({ 
                    data: { Username: request.body.Username } },
                    process.env.TOKEN_SECRET, {
                    expiresIn: 86400, //expires in 24 hours
                });

                response.send(token);
            } else {
                response.send('Wrong Username or Password.');
            }

        }

        else {
            response.send('Wrong Username or Password.');
        }

    } catch (error) {
        response.status(400).send(error);
    }




});
