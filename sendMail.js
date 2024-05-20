require("dotenv").config();
const express = require("express");
const { status } = require("express/lib/response");
const { encode } = require("punycode");
const route = express.Router();
var axios = require("axios").default;

route.get("/", (req, res) => {
  return res.send("Hello");
});

route.post("/sendMail", async (req, res) => {
  try {
    let data = req.body;
    data = Object.keys(data)[0];
    let { mail, content, subject } = JSON.parse(data);

    if (!mail || !content || !subject)
      return res.status(204).send({ status: 204, message: "Missing payload." });

    let options = {
      method: "POST",
      url: `https://login.microsoftonline.com/${process.env.Tantive_ID}/oauth2/v2.0/token`,
      headers: {
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
      },
      data: '-----011000010111000001101001\r\nContent-Disposition: form-data; name="grant_type"\r\n\r\nclient_credentials\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="client_id"\r\n\r\n9c9515e7-0df9-4cc9-be4f-9b33c9ddae26\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="scope"\r\n\r\nhttps://graph.microsoft.com/.default\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="client_secret"\r\n\r\nrxn8Q~p79xG8V5ezH3-KF3og~B2gstlRKot3Ldhq\r\n-----011000010111000001101001--\r\n',
    };

    let response = await axios.request(options);

    let { access_token: token } = response.data;
    // send mail
    if (token) return sendMail(token, res, mail, content, subject);
    else return res.status(500).send(error);
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Something went wrong. Please try again Token.",
      payload: process.env.Tantive_ID,
    });
  }
});

async function sendMail(token, res, mail, content, subject) {
  try {
    var options = {
      method: "POST",
      url: `https://graph.microsoft.com/v1.0/users/${process.env.mail_ID}/sendMail`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        message: {
          subject,
          body: { contentType: "HTML", content },
          toRecipients: [{ emailAddress: { address: mail } }],
          ccRecipients: [
            {
              emailAddress: { address: "kwalton@dcsconsulting.com" },
            },
          ],
          bccRecipients: [
            { emailAddress: { address: "siddharth@wholesomemedia.in" } },
            { emailAddress: { address: "prateek@wholesomemedia.in" } },
          ],
        },
        saveToSentItems: "false",
      },
    };

    const respose = await axios.request(options);

    return res.redirect("https://dcsconsulting.co/thanks.html");
    return res.status(200).send({
      status: 200,
      message: `Mail sent successfully to ${mail}.`,
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong. Please try again. In send Mail",
    });
  }
}

module.exports = route;
