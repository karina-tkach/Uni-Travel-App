CREATE TABLE transport_offers (
                                  id BIGSERIAL PRIMARY KEY,
                                  point_a VARCHAR(100) NOT NULL,
                                  point_b VARCHAR(100) NOT NULL,
                                  travel_date DATE NOT NULL,
                                  transport_type VARCHAR(255) NOT NULL,
                                  description TEXT NOT NULL,
                                  price NUMERIC(10,2) NOT NULL,
                                  old_price NUMERIC(10,2),
                                  rating NUMERIC(2,1) NOT NULL,
                                  available_seats INTEGER NOT NULL,
                                  image_url TEXT NOT NULL,
                                  booking_url TEXT NOT NULL,
                                  partner_id BIGINT NOT NULL REFERENCES partners(id)
);
