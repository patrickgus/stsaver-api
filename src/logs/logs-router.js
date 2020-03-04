const path = require("path");
const express = require("express");
const LogsService = require("./logs-service");
const { requireAuth } = require("../middleware/jwt-auth");

const logsRouter = express.Router();
const jsonParser = express.json();

logsRouter
  .route("/:user_id/")
  .all(requireAuth)
  .get((req, res, next) => {
    LogsService.getLogsByUserId(req.app.get("db"), req.params.user_id)
      .then(logs => {
        res.json(logs);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { start_time, end_time, media, breaks } = req.body;
    const newLog = { start_time, end_time, media, breaks };

    for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    newLog.user_id = req.user.id;

    LogsService.insertLog(req.app.get("db"), newLog)
      .then(log => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${log.id}`))
          .json(log);
      })
      .catch(next);
  });

logsRouter
  .route("/:user_id/hours/")
  .all(requireAuth)
  .get((req, res, next) => {
    LogsService.getHoursByUserId(req.app.get("db"), req.params.user_id)
      .then(hours => {
        res.json(hours.rows);
      })
      .catch(next);
  });

logsRouter
  .route("/:user_id/:log_id/")
  .all(requireAuth)
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
  })
  .patch(jsonParser, (req, res, next) => {
    const { start_time, end_time, media, breaks } = req.body;
    const logToUpdate = { start_time, end_time, media, breaks };

    const numberOfValues = Object.values(logToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'start_time', 'end_time', 'media', 'breaks'`
        }
      });

    LogsService.updateLog(
      req.app.get("db"),
      req.params.user_id,
      req.params.log_id,
      logToUpdate
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
