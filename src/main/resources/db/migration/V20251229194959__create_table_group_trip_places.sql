CREATE TABLE group_trip_places (
                                   group_trip_id BIGINT NOT NULL,
                                   place_offer_id BIGINT NOT NULL,
                                   PRIMARY KEY (group_trip_id, place_offer_id),

                                   FOREIGN KEY (group_trip_id) REFERENCES group_trips(id),
                                   FOREIGN KEY (place_offer_id) REFERENCES places_offers(id)
);
