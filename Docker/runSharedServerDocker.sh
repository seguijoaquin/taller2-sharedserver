#!/bin/bash


docker run -i -w /home/taller2-sharedserver/localconfig -p 5000:5000 -d --name webshared shared-server-docker sh ./runlocally.sh




# -t shared-server-docker # funciona




#-d -P --name webshared shared-server-docker sh ./runlocally.sh
