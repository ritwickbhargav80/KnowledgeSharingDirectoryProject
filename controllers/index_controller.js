module.exports.index = (req, res) => {
  res.json({ message: "KSD API" });
};

module.exports.sendmessage = (req, res) => {
  let { name, email, phone, message } = req.body;
  Message.create(req.body, (err, done) => {
    if (err) throw err;
    else {
      req.json({ message: "Your message has been submitted successfully." });
    }
  });
};
