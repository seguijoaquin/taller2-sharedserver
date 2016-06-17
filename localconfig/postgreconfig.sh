#!/bin/bash

createdb myDB

#Users
psql myDB -c "CREATE TABLE users ( id_user SERIAL PRIMARY KEY, name TEXT NOT NULL, alias TEXT, email TEXT NOT NULL, sex TEXT NOT NULL, edad INTEGER NOT NULL, latitude REAL, longitude REAL, photo_profile TEXT );"


#Pictures

psql myDB -c "CREATE TABLE pictures ( id_picture SERIAL PRIMARY KEY, id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE, pic TEXT );"

#Interests

psql myDB -c "CREATE TABLE interests ( id_interest SERIAL PRIMARY KEY, category TEXT NOT NULL REFERENCES categories(category) ON DELETE CASCADE, value TEXT, UNIQUE (category, value) );"

#User_Interests

psql myDB -c "CREATE TABLE users_interests ( id_usr_int SERIAL PRIMARY KEY, id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE, id_interest INTEGER NOT NULL REFERENCES interests(id_interest) ON DELETE CASCADE );"


psql myDB -c "CREATE TABLE categories ( id_category SERIAL PRIMARY KEY, category TEXT UNIQUE NOT NULL );"
