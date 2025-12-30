CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    surname   VARCHAR NOT NULL,
    password  VARCHAR NOT NULL,
    email     VARCHAR UNIQUE NOT NULL,
    role      VARCHAR NOT NULL
);
INSERT INTO users (name, surname, password, email, role) VALUES
                                                    ('Julia', 'Fox', '$2a$12$9aePrcOq.8iy.YIrVyoRReDprO5k./34i0UBeuZUs.qJOMN2Pd2X6', 'admin@gmail.com', 'ADMIN'),
                                                    ('Karina', 'Tkach', '$2a$12$Vt5u.kWPJP3FD7/BDiBaCOsBbgC36cEMdbKfqVmJjgVweLHE48hmu', 'visitor@gmail.com', 'VISITOR');
