const axios = require("axios");
require("dotenv").config();

module.exports.ongoing = (req, res) => {
  axios
    .get("https://contesttrackerapi.herokuapp.com")
    .then(response => {
      res.json({ contests: response.data.result.ongoing });
    })
    .catch(error => res.status(404).json({ message: "error" }));
};

module.exports.upcoming = (req, res) => {
  axios
    .get("https://contesttrackerapi.herokuapp.com")
    .then(response => {
      res.json({ contests: response.data.result.upcoming });
    })
    .catch(error => res.status(404).json({ message: "error" }));
};
