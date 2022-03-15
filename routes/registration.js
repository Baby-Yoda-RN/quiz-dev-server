import express from 'express';
import AWS from 'aws-sdk';
import bcrypt from "bcryptjs";
import { handleGetUser } from '../models/handleGetUser.js';
import { handleRegistration } from '../models/handleRegistration.js';

export const router = express.Router();

// The client make a post request to '/register', allowing a new account to be created (add) to database.
router.post('/register', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // request body should include at least username, email and password

    // Validate data

    // Check if user exists in database, if not create account else send error message
    const parametersGetUser = {
        TableName: request.body.TableName, 
        Key: {
            Username: request.body.Username,
            //id: 0, // should we increment id starting with 0 or use uuid?
        }
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.Password, salt);

    const parametersRegister = {
        TableName: request.body.TableName, 
        Item: {
            // id: 0, 
            email: request.body.email, 
            Username: request.body.Username, 
            Password: hashPassword
        },
        // This makes sure that if Username exists, it will NOT add to database.
        ConditionExpression: "attribute_not_exists(Username)"
    };


    try {
        // Check if Username already exist
        const checkUserExist = await handleGetUser(documentClient, parametersGetUser);

        // If Username already exists, prevent registration.
        if (checkUserExist.Item.Username == parametersGetUser.Key.Username) {
            console.log(`${parametersGetUser.Key.Username} exists`);
            response.send('Username already exist');
        }
        // Only register if user doesn't exist
        else {
            try {
                handleRegistration(documentClient, parametersRegister);
                response.send('Successfully Added User');
            } catch (error) {
                response.status(400).send(error);
            }
        }

    } catch (error) {
        response.status(400).send('error');
    }




});
