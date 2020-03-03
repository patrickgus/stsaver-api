require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config");
const logsRouter = require("./logs/logs-router");
const usersRouter = require("./users/users-router");
const errorHandler = require("./error-handler");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === "test"
  })
);
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));

app.use("/api/logs", logsRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

module.exports = app;
