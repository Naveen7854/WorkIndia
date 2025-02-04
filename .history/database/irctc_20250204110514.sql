CREATE DATABASE irctc;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(400)
);

--- CRAETE ADMIN SCHEMA ---
CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(400),
    api_key VARCHAR(400)
);


--- CREATE BOOKINGS SCHEMA ---
CREATE TABLE bookings(
       user_id INT REFERENCES users(id),
    train_id INT REFERENCES trains(id)
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    start_station VARCHAR(400),
    end_station VARCHAR(400),
    booking_id VARCHAR(400)
);

--- CREATE TRAINS SCHEMA ---
CREATE TABLE trains(
    id SERIAL PRIMARY KEY,
    start_station VARCHAR(400),
    end_station VARCHAR(400),
    seats_available VARCHAR(400),
    seats_filled VARCHAR(400)
);