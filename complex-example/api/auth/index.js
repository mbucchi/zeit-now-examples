const { WebClient } = require("@slack/client");
const url = require("url");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const client = new WebClient();

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  res.setHeader("Content-Type", "application/json");
  if (!query.code) { 
    return res.end(JSON.stringify({error: "code is missing in url query"}))
  }
  const oauth = await client.oauth.access({client_id, client_secret, code: query.code});
  res.end(JSON.stringify(oauth));
};
