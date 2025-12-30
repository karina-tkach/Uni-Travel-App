CREATE TABLE housing_cache (
                               id BIGSERIAL PRIMARY KEY,
                               cache_key VARCHAR(255) NOT NULL,
                               page_number INT NOT NULL,
                               provider VARCHAR(50),
                               payload JSONB NOT NULL
);

CREATE INDEX idx_housing_cache_key_page
    ON housing_cache (cache_key, page_number);
