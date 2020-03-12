module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "https://stsaver-app.now.sh",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://hcpyicqpvkioye:f5f8f6b3220ecc955cf26e7ed55899249d23f0d18f3daa77ecd59db88b7eb5d5@ec2-35-168-54-239.compute-1.amazonaws.com:5432/d3808r8862mrph",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://patrick_gus@localhost/stsaver_test",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "3h"
};
