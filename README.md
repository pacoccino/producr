producr
=======

> A web application to analyse your SoundCloud activity, such as listening history, stats about your tracks etc...

![History screenshot](https://raw.githubusercontent.com/pakokrew/producr/master/docs/screenhistory.png)

----------

## Running

You need to have Nodejs v6+ installed.

- Install dependencies
`npm install`

- Configure the app such as ports and databases either in `src/config.json`, via environment variables or in `docker-compose.override.yml` file.

#### Run all services with docker compose
`docker-compose build`
`docker-compose up`

#### Run all-in-one dev server
`npm run server`
*You need to have MongoDb and Redis servers up*

#### Run production server
`npm run build && npm start`

> In order to validate oAuth callback, you currently have to use localhost:3000 as application address.

## Technologies used

- React
- Redux
- immutable
- node
- express
- JWT
- Redis
- MongoDB
- ES6
- AVA
- Webpack
- Babel

## Linting

This project is NOT linted. Linting is a good method to keep consistency over code, and mostly for catching bugs.
I intentionaly don't use a tool like eslint, because I believe that one can write neat code without being watched by a list of rules.
Tests fix the rest.
