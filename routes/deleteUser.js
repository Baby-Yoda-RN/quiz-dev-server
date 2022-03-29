import express from 'express';
import AWS from 'aws-sdk';
import { readWriteToDatabase } from '../models/readWriteToDatabase.js';

export const routerDelete = express.Router();

// The client make a post request to '/deleteuser', allowing an account to be deleted from database.
routerDelete.post('/deleteuser', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // Check if user exists in database, if not create account else send error message
    const parametersGetUser = {
        TableName: request.body.TableName, 
        Key: {
            Username: request.body.Username,
            //id: 0, // should we increment id starting with 0 or use uuid?
        }
    };

    const parametersDelete = {
        TableName: request.body.TableName, 
        Key: {
            Username: request.body.Username, 
        },
    };


    try {
        // Check if Username already exist
        const checkUserExist = await readWriteToDatabase(documentClient, parametersGetUser, 'get');

        // If Username already exists, delete account.
        if (Object.keys(checkUserExist).length > 0) {
            try {
                readWriteToDatabase(documentClient, parametersDelete, 'delete');
                response.send('Successfully Deleted User');
            } catch (error) {
                response.status(400).send(error);
            }
        }

        // Only register if user doesn't exist
        else {
            console.log(`${parametersGetUser.Key.Username} doesn't exist`);
            response.send(`${parametersGetUser.Key.Username} doesn't exist`);
        }

    } catch (error) {
        response.status(400).send(error);
    }




});
