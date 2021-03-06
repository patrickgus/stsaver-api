CREATE TABLE stsaver_users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_joined TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE stsaver_logs
  ADD COLUMN
    user_id INTEGER REFERENCES stsaver_users(id)
    ON DELETE SET NULL;
    