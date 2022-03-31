import express from 'express';
import AWS from 'aws-sdk';
import { readWriteToDatabase } from '../models/readWriteToDatabase.js';

export const routerGetQuestions = express.Router();

// The client make a get request to '/getonequestion', requesting one question from database.
routerGetQuestions.get('/getquestions/:category', async(request, response) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    const parametersGetAllQuestions = {
        TableName: process.env.QuestionTableName,
        FilterExpression: "#category = :category",
        ExpressionAttributeNames:{
            "#category": "category"
        },
        ExpressionAttributeValues: {
            ":category": request.params.category
        }
    };

    try {
        const allQuestions = await readWriteToDatabase(documentClient, parametersGetAllQuestions, 'scan');
        //console.log(allQuestions.Items);
        response.send(allQuestions.Items);

    } catch (error) {
        response.status(400).send(error);
    }




});
