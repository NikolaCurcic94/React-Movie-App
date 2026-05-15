-- Resets movie data safely without touching user accounts.
-- user_favorites depends on both movies and users, so drop it first.
-- users is intentionally NOT dropped: rerunning this migration must never
-- destroy existing accounts or their hashed passwords.
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS movies;

-- Create users only if it does not already exist; never overwrite.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE movies (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(500) NOT NULL,
  year        INTEGER NOT NULL,
  director    VARCHAR(500) NOT NULL,
  actors      TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  img_url     TEXT NOT NULL DEFAULT '',
  genre       TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movies_title ON movies USING GIN (to_tsvector('english', title));
CREATE INDEX idx_movies_genre ON movies USING GIN (genre);

CREATE TABLE user_favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  movie_id   INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, movie_id)
);

CREATE INDEX idx_user_favorites_user_id  ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_movie_id ON user_favorites(movie_id);
