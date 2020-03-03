const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    {
      id: 1,
      date_joined: "2020-02-22T16:28:32.615Z",
      first_name: "Test",
      last_name: "User1",
      username: "test-user-1",
      password: "secret"
    },
    {
      id: 2,
      date_joined: "2020-03-01T16:28:32.615Z",
      first_name: "Test",
      last_name: "User2",
      username: "test-user-2",
      password: "password"
    }
  ];
}

function makeLogsArray(users) {
  return [
    {
      id: 1,
      start_time: "2020-02-24 16:00:00",
      end_time: "2020-02-24 18:00:00",
      media: "Phone",
      breaks: 0,
      date_added: "2020-02-24T20:28:32.615Z",
      user_id: users[0].id
    },
    {
      id: 2,
      start_time: "2020-02-25 13:00:00",
      end_time: "2020-02-25 16:00:00",
      media: "Computer",
      breaks: 5,
      date_added: "2020-02-25T18:00:32.615Z",
      user_id: users[0].id
    },
    {
      id: 3,
      start_time: "2020-02-26 7:00:00",
      end_time: "2020-02-26 11:00:00",
      media: "Computer",
      breaks: 10,
      date_added: "2020-02-26T16:28:32.615Z",
      user_id: users[0].id
    },
    {
      id: 4,
      start_time: "2020-03-02 8:00:00",
      end_time: "2020-03-02 13:00:00",
      media: "Tablet",
      breaks: 15,
      date_added: "2020-03-02T14:00:32.615Z",
      user_id: users[1].id
    },
    {
      id: 5,
      start_time: "2020-03-02 16:00:00",
      end_time: "2020-03-02 18:00:00",
      media: "Phone",
      breaks: 0,
      date_added: "2020-03-02T20:00:32.615Z",
      user_id: users[1].id
    }
  ];
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

module.exports = {
  makeUsersArray,
  makeLogsArray,
  makeLogsFixtures,
  cleanTables,
  seedUsers,
  seedLogsTables
};
