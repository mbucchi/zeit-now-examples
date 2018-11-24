const { WebClient } = require("@slack/client");
const url = require("url");

async function getAllChannels(token) {
  const web = new WebClient(token);
  const param = {
    exclude_archived: true,
    types: "public_channel",
    limit: 100
  };
  return web.conversations.list(param).then(results => results.channels);
}

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  res.setHeader("Content-Type", "application/json");
  if (query.token) { 
    const channels = await getAllChannels(query.token);
    res.end(JSON.stringify({channels}));
  }
  else {
      res.end(JSON.stringify({error: "token is missing in url query"}))
  }
};
