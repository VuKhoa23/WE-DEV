const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { checkCurrentUser } = require("./middlewares/authMiddleWares");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const appRouter = require("./routes/wedev");
const adminRouter = require("./routes/wedevAdmin");
const app = express();

// Get around CORS policy
app.use(
  cors({
    origin: "*",
  })
);

// bootstrap
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
// apply bootstrap to wedev urls

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("*", checkCurrentUser);

app.use("/", indexRouter);
app.use("/wedev", authRouter);
app.use("/wedev", appRouter);
app.use("/wedev-admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.send("404");
});

module.exports = app;
