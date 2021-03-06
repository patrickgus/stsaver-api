const LogsService = {
  getLogsByUserId(db, user_id) {
    return db
      .from("stsaver_logs AS log")
      .select(
        "log.id",
        "log.start_time",
        "log.end_time",
        "log.media",
        "log.breaks",
        "log.date_added",
        "log.user_id",
        db.raw(`(DATE_PART('day',  log.end_time::timestamp - log.start_time::timestamp) * 24 + 
          DATE_PART('hour', log.end_time::timestamp - log.start_time::timestamp)) AS hours`)
      )
      .leftJoin("stsaver_users AS user", "log.user_id", "user.id")
      .where("log.user_id", user_id)
      .orderBy("log.id");
  },

  getHoursByUserId(db, user_id) {
    return db
      .select(
        db.raw(
          `SUM(hours) FROM
        (SELECT 
          (DATE_PART('day',  log.end_time::timestamp - log.start_time::timestamp) * 24 + 
          DATE_PART('hour', log.end_time::timestamp - log.start_time::timestamp)) AS hours
        FROM stsaver_logs AS log
        WHERE log.user_id = ${user_id}) AS total_hours`
        )
      )
      .first();
  },

  insertLog(db, newLog) {
    return db
      .insert(newLog)
      .into("stsaver_logs")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getById(db, user_id, log_id) {
    return LogsService.getLogsByUserId(db, user_id)
      .where("log.id", log_id)
      .first();
  },

  deleteLog(db, user_id, log_id) {
    return LogsService.getById(db, user_id, log_id).delete();
  },

  updateLog(db, user_id, log_id, newLogFields) {
    return LogsService.getById(db, user_id, log_id).update(newLogFields);
  }
};

module.exports = LogsService;
