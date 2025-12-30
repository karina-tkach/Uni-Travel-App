CREATE TABLE group_trip_users (
                                  group_trip_id BIGINT NOT NULL,
                                  user_id BIGINT NOT NULL,
                                  PRIMARY KEY (group_trip_id, user_id),

                                  FOREIGN KEY (group_trip_id) REFERENCES group_trips(id),
                                  FOREIGN KEY (user_id) REFERENCES users(id)
);
