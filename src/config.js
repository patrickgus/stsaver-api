module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000/",
  DB_URL: process.env.DB_URL || "postgresql://patrick_gus@localhost/stsaver",
  TEST_DB_URL:
    process.env.TEST_DB_URL || "postgresql://patrick_gus@localhost/stsaver_test"
};
