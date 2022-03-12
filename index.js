import express from 'express';
import AWS from 'aws-sdk';
import {getOneUser} from './models/getOneUser.js';

const app = express();
const port = 3000;


// Middleware
app.use(express.json({ limit: '5MB', extended: true }));
app.use(express.urlencoded({ limit: '5MB', extended: true }));


app.get('/', (request, response) => {
  response.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


// AWS DymanoDB Setup
AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

AWS.config.loadFromPath('./config.json');

const documentClient = new AWS.DynamoDB.DocumentClient();

const parameters = {
    TableName: 'Users',
    Key: {
        id: 0,
    }
  };

// Test get one user
getOneUser(documentClient, parameters);