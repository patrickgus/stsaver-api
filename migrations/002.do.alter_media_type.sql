CREATE TYPE media_type AS ENUM (
  'computer',
  'phone',
  'tablet',
  'television'
);

ALTER TABLE stsaver_logs
  ADD COLUMN
    media media_type NOT NULL;
