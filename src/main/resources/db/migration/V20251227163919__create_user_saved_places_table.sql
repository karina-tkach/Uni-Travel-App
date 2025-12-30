CREATE TABLE user_saved_places (
                                   id BIGSERIAL PRIMARY KEY,

                                   user_id INTEGER NOT NULL,
                                   place_id BIGINT NOT NULL,

                                   CONSTRAINT fk_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users (id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_place
                                       FOREIGN KEY (place_id)
                                           REFERENCES places_offers (id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT uq_user_place
                                       UNIQUE (user_id, place_id)
);

CREATE INDEX idx_user_saved_places_user
    ON user_saved_places (user_id);

CREATE INDEX idx_user_saved_places_place
    ON user_saved_places (place_id);