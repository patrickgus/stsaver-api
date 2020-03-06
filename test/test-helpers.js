const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      date_joined: "2020-02-22T16:28:32.615Z",
      first_name: "Test",
      last_name: "User1",
      username: "test-user-1",
      password: "secret"
    }
  ];
}

function makeLogsArray(users) {
  return [
    {
      id: 1,
      start_time: "2020-02-24 16:00",
      end_time: "2020-02-24 18:00",
      media: "phone",
      breaks: 0,
      date_added: "2020-02-24T20:28:32.615Z",
      user_id: users[0].id
    },
    {
      id: 2,
      start_time: "2020-02-25 13:00",
      end_time: "2020-02-25 16:00",
      media: "computer",
      breaks: 5,
      date_added: "2020-02-25T18:00:32.615Z",
      user_id: users[0].id
    },
    {
      id: 3,
      start_time: "2020-02-26 7:00",
      end_time: "2020-02-26 11:00",
      media: "computer",
      breaks: 10,
      date_added: "2020-02-26T16:28:32.615Z",
      user_id: users[0].id
    }
  ];
}

function makeExpectedLog(user, log) {
  const hours = calculateHours(log);

  return {
    id: log.id,
    start_time: new Date(log.start_time).toISOString(),
    end_time: new Date(log.end_time).toISOString(),
    media: log.media,
    breaks: log.breaks,
    date_added: log.date_added,
    user_id: user.id,
    hours
  };
}

function calculateHours(log) {
  const start = new Date(log.start_time);
  const end = new Date(log.end_time);
  const res = Math.abs(end - start) / 1000;

  return Math.floor(res / 3600) % 24;
}

function makeLogsFixtures() {
  const testUsers = makeUsersArray();
  const testLogs = makeLogsArray(testUsers);
  return { testUsers, testLogs };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        stsaver_logs,
        stsaver_users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE stsaver_logs_id_seq minvalue 0 START WITH 1`),
          trx.raw(
            `ALTER SEQUENCE stsaver_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('stsaver_logs_id_seq', 0)`),
          trx.raw(`SELECT setval('stsaver_users_id_seq', 0)`)
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("stsaver_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('stsaver_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function seedLogsTables(db, users, logs, reviews = []) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("stsaver_logs").insert(logs);
    await trx.raw(`SELECT setval('stsaver_logs_id_seq', ?)`, [
      logs[logs.length - 1].id
    ]);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeLogsArray,
  makeExpectedLog,
  makeLogsFixtures,
  cleanTables,
  seedUsers,
  seedLogsTables,
  makeAuthHeader
};
