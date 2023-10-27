const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        res.redirect("/wedev/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/wedev/login");
  }
}

module.exports = { requireAuth };
