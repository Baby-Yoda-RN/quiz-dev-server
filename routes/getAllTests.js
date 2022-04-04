import express from 'express';
import AWS from 'aws-sdk';
import { readWriteToDatabase } from '../models/readWriteToDatabase.js';
import { delayTime } from '../constants/index.js';

export const routerGetAllTests = express.Router();

// The client make a post request to '/deleteuser', allowing an account to be deleted from database.
routerGetAllTests.get('/getalltests', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // Check if user exists in database, if not create account else send error message
    const parametersGetAllTests = {
        TableName: process.env.TableName
    };

    try {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(delayTime);

        const allTests = await readWriteToDatabase(documentClient, parametersGetAllTests, 'scan');

        const sortedAllTests = allTests.Items.sort((firstItem, secondItem) => firstItem.id - secondItem.id);

        // console.log(sortedAllTests);

        response.send(sortedAllTests);

    } catch (error) {
        response.status(400).send(error);
    }




});
