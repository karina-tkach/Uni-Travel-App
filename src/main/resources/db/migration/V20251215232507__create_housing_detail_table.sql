CREATE TABLE housing_detail (
                                id BIGSERIAL PRIMARY KEY,
                                housing_id BIGINT NOT NULL,
                                provider VARCHAR(50) NOT NULL,
                                hotel_name TEXT NOT NULL,
                                price DOUBLE PRECISION NOT NULL,
                                check_in VARCHAR(10) NOT NULL,
                                check_out VARCHAR(10) NOT NULL,
                                image_url TEXT NOT NULL,
                                review_score DOUBLE PRECISION NOT NULL,
                                city TEXT NOT NULL,
                                description TEXT,
                                url TEXT NOT NULL,
                                full_address TEXT NOT NULL,
                                photos JSONB NOT NULL
);

CREATE INDEX idx_housing_detail_item
    ON housing_detail (housing_id, provider);
