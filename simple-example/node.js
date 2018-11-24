module.exports = (req, res) => {
  // returns current date-time
  res.end(new Date().toString());
};
