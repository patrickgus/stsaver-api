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
      .where("log.user_id", user_id);
  }
};

module.exports = LogsService;
