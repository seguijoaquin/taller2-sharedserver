#!/bin/bash

sudo /etc/init.d/postgresql start


su postgres  ./postgreconfig.sh

cd ..

#CAMBIO LA URL DE LA DB a local
sed -i.bak "s-POSTGRE_URL_DB:.*-POSTGRE_URL_DB: \"postgres://postgres:postgres@localhost:5432/myDB\",-g" constants/constants.js

cd routes

#Cambiar SSL en users.js
#sed -i.bak "s-pg\.defaults\.ssl =.*-//pg\.defaults\.ssl = true;-g" users.js
