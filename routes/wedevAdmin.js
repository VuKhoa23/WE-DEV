const express = require("express");
const router = express.Router();
const {
  requireAdminRole,
  requireAuth,
} = require("../middlewares/authMiddleWares");

/* GET home page. */
router.get("/", requireAuth, requireAdminRole, function (req, res, next) {
  const email = res.locals.user === null ? "" : res.locals.user.email;
  res.render("admin", { title: "Admin", email: email });
});

module.exports = router;
