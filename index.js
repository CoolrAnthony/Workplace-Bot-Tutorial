////These are our helper modules////
const express = require("express");
const bodyParser = require("body-parser");
let app = express();
let port = process.env.PORT || 3000;
const axios = require("axios");
app.use(bodyParser.json());

////An instance of Axios with our Workplace Bot settings defaulted in
const workplaceAPI = axios.create({
  method: "POST",
  baseURL: "https://graph.facebook.com/me/messages",
  headers: {
    Authorization: "Bearer <YourToken>" ////Put your access token here <--------------
  }
});

const sendMessage = (id, message) => {
  workplaceAPI({
    data: {
      recipient: {
        id: id
      },
      message: {
        text: message
      }
    }
  });
};

////Webhook Subscription Event////
app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] ===
      "ThisIsARandomStringThatIJustMadeUpOnTheSpot"
  ) {
    console.log("Validated webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

////Inbound Messages from Workplace////
app.post("/webhook", (req, res) => {
  let uuid = req.body.entry[0].messaging[0].sender.id;
  let message = req.body.entry[0].messaging[0].message.text;
  console.log("Received a message from", uuid, "now replying");
  sendMessage(uuid, message);
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`App listening on port ${port}!\n \nhttps://www.WeAreCoolr.com`)
);
