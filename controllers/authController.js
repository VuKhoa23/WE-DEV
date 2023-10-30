const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

function handleError(err) {
  const errors = { username: "", email: "", password: "" };

  if (err.message.includes("E11000")) {
    if (err.message.includes("username:")) {
      errors.username = "Duplicate username";
    } else {
      errors.email = "Duplicate email";
    }
  }

  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
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
  console.log(username, email, password);
  try {
    const user = await User.create({ username, email, password });
    res.status(200).json({ message: "success" });
  } catch (err) {
    // check the mongoose error code
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res, next) => {
  let message = "";
  if (req.query.signedUp != undefined) {
    message = "You now can login";
    console.log(message);
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
    if (errors.email != "") {
      res.redirect("/wedev/login?email=false");
      return;
    } else if (errors.password != "") {
      res.redirect("/wedev/login?password=false");
      return;
    }
    res.redirect("/wedev/login");
  }
};

module.exports.logout_get = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
