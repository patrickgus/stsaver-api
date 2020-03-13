BEGIN;

TRUNCATE
  stsaver_logs,
  stsaver_users
  RESTART IDENTITY CASCADE;

INSERT INTO stsaver_users(first_name, last_name, username, password)
VALUES
  ('Test', 'User', 'testuser', '$2a$12$8OANFtERG4sNsa/ugKSS0.b39MzjdRyDgVeaLYzVdkBSpg47.Nh1W'),
  ('Patrick', 'Gustafson', 'patrickgus', '$2a$12$LcmgyvWUKG0HPXnq.ZHQVO84HDaTq133Y7fJBG8Oz/oaJCF2GvjKa');

INSERT INTO stsaver_logs(start_time, end_time, media, breaks, user_id)
VALUES
  ('2020-03-06 16:00', '2020-03-06 20:00', 'television', 0, 1),
  ('2020-03-07 7:00', '2020-03-07 14:00', 'computer', 15, 1),
  ('2020-03-07 16:00', '2020-03-07 20:00', 'tablet', 5, 1),
  ('2020-03-08 7:00', '2020-03-08 12:00', 'computer', 10, 1),
  ('2020-03-08 17:00', '2020-03-08 19:00', 'phone', 0, 1),
  ('2020-03-10 8:00', '2020-03-10 11:00', 'computer', 8, 2),
  ('2020-03-10 19:00', '2020-03-10 21:00', 'television', 0, 2),
  ('2020-03-11 7:00', '2020-03-11 12:00', 'computer', 12, 2);

COMMIT;
