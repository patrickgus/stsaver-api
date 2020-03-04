const path = require("path");
const express = require("express");
const LogsService = require("./logs-service");

const logsRouter = express.Router();
const jsonParser = express.json();

logsRouter
  .route("/:user_id/")
  .get((req, res, next) => {
    LogsService.getLogsByUserId(req.app.get("db"), req.params.user_id)
      .then(logs => {
        res.json(logs);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { start_time, end_time, media, breaks, user_id } = req.body;
    const newLog = { start_time, end_time, media, breaks, user_id };

    for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    LogsService.insertLog(req.app.get("db"), newLog)
      .then(log => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${log.id}`))
          .json(log);
      })
      .catch(next);
  });

logsRouter.route("/:user_id/hours/").get((req, res, next) => {
  LogsService.getHoursByUserId(req.app.get("db"), req.params.user_id)
    .then(hours => {
      res.json(hours.rows);
    })
    .catch(next);
});

logsRouter
  .route("/:user_id/:log_id/")
  .all(checkLogExists)
  .get((req, res, next) => {
    res.json(res.log);
  })
  .delete((req, res, next) => {
    LogsService.deleteLog(
      req.app.get("db"),
      req.params.user_id,
      req.params.log_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkLogExists(req, res, next) {
  try {
    const log = await LogsService.getById(
      req.app.get("db"),
      req.params.user_id,
      req.params.log_id
    );

    if (!log)
      return res.status(404).json({
        error: `Log doesn't exist`
      });

    res.log = log;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = logsRouter;
