const User = require("../models/userModel");

function handleError(err) {
  const theError = { username: "", email: "", password: "" };
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      theError[properties.path] = properties.message;
    });
  }
  return theError;
}

module.exports.signup_get = (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
};

module.exports.signup_post = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(200).send(user);
  } catch (err) {
    // check the mongoose error code
    if (err.message.includes("E11000")) {
      if (err.message.includes("username:")) {
        res.status(400).send({ error: "Duplicate username" });
        return;
      } else {
        res.status(400).send({ error: "Duplicate email" });
        return;
      }
    }
    const theError = handleError(err);
    res.status(400).send(theError);
  }
};

module.exports.login_get = (req, res, next) => {
  res.send("This will handle get login");
};

module.exports.login_post = (req, res, next) => {
  res.send("This will handle post login");
};
