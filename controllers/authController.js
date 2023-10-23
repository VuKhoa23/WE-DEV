module.exports.signup_get = (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
};

module.exports.signup_post = (req, res, next) => {
  res.send("This will handle post signup");
};

module.exports.login_get = (req, res, next) => {
  res.send("This will handle get login");
};

module.exports.login_post = (req, res, next) => {
  res.send("This will handle post login");
};
