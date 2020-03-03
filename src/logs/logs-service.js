const LogsService = {
  getAllLogs(db) {
    return db.from("stsaver_logs").select("*");
  }
};

module.exports = LogsService;
