const express = require("express");
const LogsService = require("./logs-service");

const logsRouter = express.Router();

logsRouter.route("/:user_id/").get((req, res, next) => {
  LogsService.getLogsByUserId(req.app.get("db"), req.params.user_id)
    .then(logs => {
      res.json(logs);
    })
    .catch(next);
});

module.exports = logsRouter;
