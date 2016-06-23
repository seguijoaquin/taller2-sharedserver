# Taller II - Shared Server

## Tecnologies

- Node js (express)
- PostgreSQL (pg)
- Heroku
- Docker
- Bootstrap
- Git

How to install dependencies and tecnologies required for deploy [here](https://github.com/seguijoaquin/taller2-sharedserver/wiki/Dependencies)

### Heroku

http://t2shared.herokuapp.com

App connected to this repository.
Automatically deploys from master.
Every push to master will deploy a new version of this app, deploys happen automatically

Link repository to heroku app:
-----------------------------

`$ git remote add heroku git@heroku.com:t2shared.git`

`$ heroku git:remote -a t2shared`

To open the app:

`$ heroku open`


Run the server locally
-------------------
First, install all the dependencies locally
`$ npm install`

Then run
`$ node ./bin/www`

The server should be running on https://localhost:5000

Run the server locally with heroku
-------------------------------

Once heroku is installed and the repository linked to the heroku app, run:

`$ heroku local web`

The server should be running on https://localhost:5000

### Web Client

The web client runs on https://t2shared.herokuapp.com

The web client user manual can be found [here](https://github.com/seguijoaquin/taller2-sharedserver/wiki/WebClient)

### Git

To download a specific remote branch and set to track it

`$ git checkout -t origin/branch-name`

### PostgreSQL

Information about database configuration and structure [here](https://github.com/seguijoaquin/taller2-sharedserver/wiki/Database)
