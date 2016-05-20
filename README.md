# Taller II - Shared Server

## Tecnologies

- Node js (express)
- PostgreSQL (pg)
- Heroku
- Docker
- Bootstrap
- Git

### Heroku

http://t2shared.herokuapp.com

App connected to this repository.
Automatically deploys from master.
Every push to master will deploy a new version of this app, deploys happen automatically

Link repository to heroku app:
-----------------------------

`$ git remote add heroku git@heroku.com:t2shared.git`

`$ heroku git:remote -a t2shared`

Run the app locally
-------------------
First, install all the dependencies locally
`$ npm install`

Then run
`$ node ./bin/www`

The app should be running on localhost:5000

### Git

To download a specific remote branch and set to track it

`git checkout -t origin/branch-name`

### PostgreSQL

(Completar con info de tablas y cómo se crearon las tablas)
