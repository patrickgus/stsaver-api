CREATE TYPE media_type AS ENUM (
  'Computer',
  'Phone',
  'Tablet',
  'Television'
);

ALTER TABLE stsaver_logs
  ADD COLUMN
    media media_type NOT NULL;
