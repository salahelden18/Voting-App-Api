const express = require("express");
const CreateError = require("./utils/error_handle");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const userRouter = require("./routes/user_route");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, Please try again in an hour",
});

app.use("/api", limiter);

app.use(mongoSanitize());
app.use(xss());

app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(
    new CreateError(
      500,
      "This route is not defined please access a valid endpoint"
    )
  );
  // res.status(500).json({
  //   status: "fail",
  //   message: "This route is not defined please access a valid endpoint",
  // });
});

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong";

  res.status(errorStatus).json({
    status: "fail",
    message: errorMessage,
  });
});

module.exports = app;
