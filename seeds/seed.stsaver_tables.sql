BEGIN;

TRUNCATE
  stsaver_logs,
  stsaver_users
  RESTART IDENTITY CASCADE;

INSERT INTO stsaver_users(first_name, last_name, username, password)
VALUES
  ('Test', 'User', 'testuser', '$2a$12$8OANFtERG4sNsa/ugKSS0.b39MzjdRyDgVeaLYzVdkBSpg47.Nh1W'),
  ('Patrick', 'Gustafson', 'patrickgus', '$2a$12$LcmgyvWUKG0HPXnq.ZHQVO84HDaTq133Y7fJBG8Oz/oaJCF2GvjKa');

INSERT INTO stsaver_logs(date_logged, start_time, end_time, media, breaks, user_id)
VALUES
  ('2020-02-26', '17:00', '19:00', 'Phone', 0, 1),
  ('2020-02-26', '7:00', '12:00', 'Computer', 10, 1),
  ('2020-02-25', '16:00', '20:00', 'Tablet', 5, 1),
  ('2020-02-25', '7:00', '14:00', 'Computer', 15, 1),
  ('2020-02-24', '16:00', '20:00', 'Television', 0, 1),
  ('2020-03-03', '7:00', '12:00', 'Computer', 12, 2),
  ('2020-03-02', '19:00', '21:00', 'Television', 0, 2),
  ('2020-03-02', '8:00', '11:00', 'Computer', 8, 2);

COMMIT;
