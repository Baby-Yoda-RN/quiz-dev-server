import express from 'express';
import AWS from 'aws-sdk';
import { handleGetUser } from '../models/handleGetUser.js';
import { handleDeleteUser } from '../models/handleDeleteUser.js';

export const routerDelete = express.Router();

// The client make a post request to '/delete', allowing an account to be deleted from database.
routerDelete.post('/delete', async(request, response) => {

    // Should be somewhat similar to registration.js

});
