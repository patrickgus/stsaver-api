CREATE TABLE stsaver_logs (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  breaks INTEGER DEFAULT 0 NOT NULL,
  date_added TIMESTAMP DEFAULT now() NOT NULL
);
