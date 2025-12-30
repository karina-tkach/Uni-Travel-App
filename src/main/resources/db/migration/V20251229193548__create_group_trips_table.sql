CREATE TABLE group_trips (
                             id BIGSERIAL PRIMARY KEY,
                             name VARCHAR(255) NOT NULL,
                             description TEXT NOT NULL,
                             entertainment_type VARCHAR(255) NOT NULL,
                             max_participants INT NOT NULL,
                             main_image_url TEXT  NOT NULL,
                             transport_offer_id BIGINT NOT NULL,
                             housing_detail_id BIGINT NOT NULL,
                             created_by BIGINT NOT NULL,

                             CONSTRAINT fk_group_transport FOREIGN KEY (transport_offer_id)
                                 REFERENCES transport_offers(id),

                             CONSTRAINT fk_group_housing FOREIGN KEY (housing_detail_id)
                                 REFERENCES housing_detail(id),

                             CONSTRAINT fk_group_creator FOREIGN KEY (created_by)
                                 REFERENCES users(id)
);
