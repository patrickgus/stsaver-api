const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Logs Endpoints", function() {
  let db;

  const { testUsers, testLogs } = helpers.makeLogsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/logs/:user_id`, () => {
    context(`Given no logs`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and an empty list`, () => {
        return (
          supertest(app)
            .get(`/api/logs/${testUsers[0].id}`)
            // .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, [])
        );
      });
    });

    context("Given there are logs in the database", () => {
      beforeEach("insert logs", () =>
        helpers.seedLogsTables(db, testUsers, testLogs)
      );

      it("responds with 200 and all of the logs of the user that is logged in", () => {
        const expectedLogs = testLogs.map(log =>
          helpers.makeExpectedLog(testUsers[0], log)
        );
        return (
          supertest(app)
            .get(`/api/logs/${testUsers[0].id}`)
            // .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedLogs)
        );
      });
    });
  });

  describe(`GET /api/logs/:user_id/:log_id`, () => {
    context(`Given no logs`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const logId = 123456;
        return (
          supertest(app)
            .get(`/api/logs/${testUsers[0].id}/${logId}`)
            // .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Log doesn't exist` })
        );
      });
    });

    context("Given there are logs in the database", () => {
      beforeEach("insert logs", () =>
        helpers.seedLogsTables(db, testUsers, testLogs)
      );

      it("responds with 200 and the specified log", () => {
        const logId = 2;
        const expectedLog = helpers.makeExpectedLog(
          testUsers[0],
          testLogs[logId - 1]
        );

        return (
          supertest(app)
            .get(`/api/logs/${testUsers[0].id}/${logId}`)
            // .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedLog)
        );
      });
    });
  });

  describe(`POST /api/logs/:user_id`, () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));

    it(`creates a log, responding with 201 and the new log`, function() {
      const testUser = testUsers[0];
      const newLog = {
        start_time: new Date("2020-03-02 9:00"),
        end_time: new Date("2020-03-02 14:00"),
        media: "Computer",
        breaks: 8,
        user_id: testUser.id
      };
      return (
        supertest(app)
          .post(`/api/logs/${testUser.id}`)
          // .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newLog)
          .expect(201)
          .expect(res => {
            expect(res.body.start_time).to.eql(newLog.start_time.toISOString());
            expect(res.body.end_time).to.eql(newLog.end_time.toISOString());
            expect(res.body.media).to.eql(newLog.media);
            expect(res.body.breaks).to.eql(newLog.breaks);
            expect(res.body.user_id).to.eql(newLog.user_id);
            expect(res.body).to.have.property("id");
            expect(res.headers.location).to.eql(
              `/api/logs/${testUser.id}/${res.body.id}`
            );
            const expected = new Date().toLocaleString();
            const actual = new Date(res.body.date_added).toLocaleString();
            expect(actual).to.eql(expected);
          })
          .expect(res =>
            db
              .from("stsaver_logs")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.start_time).to.eql(newLog.start_time);
                expect(row.end_time).to.eql(newLog.end_time);
                expect(row.media).to.eql(newLog.media);
                expect(row.breaks).to.eql(newLog.breaks);
                expect(row.user_id).to.eql(testUser.id);
                const expectedDate = new Date().toLocaleString();
                const actualDate = new Date(row.date_added).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
              })
          )
      );
    });

    const requiredFields = [
      "start_time",
      "end_time",
      "media",
      "breaks",
      "user_id"
    ];

    requiredFields.forEach(field => {
      const newLog = {
        start_time: new Date("2020-03-02 9:00"),
        end_time: new Date("2020-03-02 14:00"),
        media: "Computer",
        breaks: 8,
        user_id: testUsers[0].id
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newLog[field];

        return (
          supertest(app)
            .post(`/api/logs/${testUsers[0].id}`)
            // .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(newLog)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        );
      });
    });
  });
});
