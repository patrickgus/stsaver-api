CREATE TYPE media_type AS ENUM (
  'Computer',
  'Phone',
  'Tablet',
  'Television'
);

CREATE TABLE stsaver_logs (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  date_logged DATE NOT NULL,
  start_time TIME(0) NOT NULL,
  end_time TIME(0) NOT NULL,
  media media_type NOT NULL,
  breaks INTEGER DEFAULT 0 NOT NULL,
  date_added TIMESTAMP DEFAULT now() NOT NULL
);
