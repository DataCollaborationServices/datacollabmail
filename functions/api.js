const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

// middleware to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/.netlify/functions/api', require("../sendMail"));
module.exports.handler = serverless(app);