CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  interest TEXT NOT NULL,
  timing TEXT NOT NULL,
  contribution TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX applications_created_at_idx ON applications(created_at DESC);
CREATE INDEX applications_interest_idx ON applications(interest);
