CREATE TABLE places_offers (
                               id BIGSERIAL PRIMARY KEY,

                               name VARCHAR(255) NOT NULL,

                               full_address VARCHAR(500) NOT NULL,

                               category VARCHAR(100) NOT NULL,

                               type VARCHAR(100) NOT NULL,

                               rating DOUBLE PRECISION NOT NULL,

                               image_url TEXT NOT NULL,

                               maps_url TEXT NOT NULL
);
