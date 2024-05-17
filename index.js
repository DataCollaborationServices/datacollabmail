require('dotenv').config()
const express = require("express");
const app = express();
// const port = process.env.PORT || 0; // for dynamically changing the port
const PORT = process.env.PORT || 8000;
const cors = require("cors");

// middleware to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/',()=>{
    res.send("Hello from DCS")
})
// redirect 
app.use("/.netlify/functions/app", require('./sendMail'));
// app.use('/api',require('./sendMail'))

app.listen(PORT, ()=>{
    console.log("Server Is Running on", PORT)
})

