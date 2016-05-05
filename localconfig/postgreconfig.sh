#!/bin/bash

createdb myDB

psql myDB -c "CREATE TABLE IF NOT EXISTS usuarios (
id SERIAL PRIMARY KEY,
name VARCHAR(40),
mail VARCHAR(40),
alias VARCHAR(40),
latitude REAL,
longitude REAL);"