const express = require("express");
const bodyParser = require("body-parser");
const { WebClient } = require("@slack/client");

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

async function sendMessage(token, channel, message) {
  const web = new WebClient(token);

  return await web.chat
    .postMessage({ channel, text: message })
    .then(() => ({ ok: true, message: "Message sent succesfully" }))
    .catch(({ data }) => ({ ok: false, error: data.error }));
}

app.post("/api/message/", async (req, res) => {
  const { query, body } = req;
  if (!query.token) {
    return res.json({ error: "token is missing in url query" });
  }
  if (!body.channel) {
    return res.json({ error: "channel id is missing in request body" });
  }
  if (!body.message) {
    return res.json({ error: "message is missing in request body" });
  }
  const status = await sendMessage(query.token, body.channel, body.message);
  res.send(status);
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready On Server http://localhost:${port}`);
});
