const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

function handleError(err) {
  const theError = { username: "", email: "", password: "" };
  if (err.message === "incorrect email") {
    theError.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    theError.password = "That password is incorrect";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      theError[properties.path] = properties.message;
    });
  }
  return theError;
}

const maxAge = 3 * 24 * 60 * 60;

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
}

module.exports.signup_get = (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
};

module.exports.signup_post = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.redirect("login?signup=true");
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
  let message = "";
  if (req.query.signup != undefined) {
    message = "You now can login";
  }
  res.render("auth/login", { title: "Login", message: message });
};

module.exports.login_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("home");
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
