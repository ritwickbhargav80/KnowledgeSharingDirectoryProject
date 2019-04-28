module.exports.index = (req, res) => {
  res.json({ message: "KSD API" });
};

module.exports.sendmessage = (req, res) => {
  let { name, email, phone, message } = req.body;
  console.log(req.body);
  if (name !== "" || email !== "" || phone !== "" || message !== "") {
    const nameRegEx = /[A-Za-z]/;
    const emailRegEx = /\S+@\S+/;
    if (nameRegEx.test(String(name))) {
      if (emailRegEx.test(String(email).toLowerCase())) {
        if (String(phone).length === 10) {
          Message.create(req.body, (err, done) => {
            if (err) throw err;
            else {
              res.json({
                message: "success"
              });
            }
          });
        } else {
          res.json({ message: "error in phone" });
        }
      } else {
        res.json({ message: "error in email" });
      }
    } else {
      res.json({ message: "error in name" });
    }
  } else {
    res.json({ message: "error" });
  }
};
