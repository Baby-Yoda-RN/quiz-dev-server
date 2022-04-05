import express from "express";
import cors from "cors";
import AWS from "aws-sdk";
import { routerRegister } from "./routes/registration.js";
import { routerLogin } from "./routes/login.js";
import { routerDelete } from "./routes/deleteUser.js";
import { routerGetAllUsers } from "./routes/getAllUsers.js";
import { routerGetAllTests } from "./routes/getAllTests.js";
import { routerGetQuestions } from "./routes/getQuestions.js";
import { routerCheckAnswers } from "./routes/checkAnswers.js";
import { routerProfile } from "./routes/profile.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// CORS
app.use(cors());

// Middleware
app.use(express.json({ limit: "5MB", extended: true }));
app.use(express.urlencoded({ limit: "5MB", extended: true }));

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// AWS DymanoDB Setup
AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
});

AWS.config.loadFromPath("./config.json");

// Route Middleware for Registration
app.use("/api", routerRegister);
app.use("/api", routerLogin);
app.use("/api", routerDelete);
app.use("/api", routerGetAllUsers);
app.use("/api", routerGetAllTests);
app.use("/api", routerGetQuestions);
app.use("/api", routerCheckAnswers);
app.use("/api", routerProfile);