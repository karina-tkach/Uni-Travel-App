CREATE TABLE partners (
                          id BIGSERIAL PRIMARY KEY,
                          user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                          service_name VARCHAR(255) NOT NULL,
                          service_url VARCHAR(255) NOT NULL
);