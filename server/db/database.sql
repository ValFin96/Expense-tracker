CREATE DATABASE expenses_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE expense_types (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    expense_type_id INT REFERENCES expense_types(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL check (amount >=0 and amount <=100),
    date DATE DEFAULT CURRENT_DATE NOT NULL
);



