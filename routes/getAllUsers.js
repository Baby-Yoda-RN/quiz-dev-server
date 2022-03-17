import express from 'express';
import AWS from 'aws-sdk';
import { handleGetAllUsers } from '../models/handleGetAllUsers.js';

export const routerGetAllUsers = express.Router();

// The client make a post request to '/deleteuser', allowing an account to be deleted from database.
routerGetAllUsers.post('/getallusers', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // Check if user exists in database, if not create account else send error message
    const parametersGetAllUsers = {
        TableName: request.body.TableName, 
    };

    try {
        const allUsers = await handleGetAllUsers(documentClient, parametersGetAllUsers);
        console.log(allUsers);
        response.send(allUsers);

    } catch (error) {
        response.status(400).send(error);
    }




});
