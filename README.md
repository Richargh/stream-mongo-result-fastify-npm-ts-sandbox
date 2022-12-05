# Stream Mongo Results to Fastify Route (Sandbox)

Shows how to stream query results from your mongodb to fastify reply with minimal memory allocation involved. 

* See [article-route](src/articles/article-route.ts) and [article-store](src/articles/article-store.ts) for _csv (file) stream_ example. Usage [below](#csv-stream).
* See [feed-route](src/feed/feed-route.ts) for _concatenate two streams_ example. Usage [below](#concatenate-stream).
* See [store-route](src/store/store-route.ts) for _mapping stream entries_ example. Usage [below](#map-stream).

## Features

* Fastify + TypeScript
* MongoDb + Mongoose
* Streams3 Api and concatenating streams
* [Newline-Deliminated Json](https://en.wikipedia.org/wiki/JSON_streaming#Newline-Delimited_JSON)
  * One standard is [ndson](http://ndjson.org/) aka `application/x-ndjson`, see also the [spec](https://github.com/ndjson/ndjson-spec).
  * Another standard is [jsonlines](https://jsonlines.org/)

### Core Concepts

### Streams

Streams are a pretty cool concept because they allow you to stream data from your database to your clients without loading all of them into memory at the same time. 
They are great until you shoot yourself in the foot, like I did by using the legacy `.pipe()` method. 
Don't use that method, because if one of the piped streams is closed or throws an error, `pipe()` will **not automatically destroy** the connected streams. 
This can cause memory leaks in applications.
I got a lot of `MaxListenersExceededWarning` errors and at some point realized the cursor was probably never closed and blamed fastify and looked for stuff and and and.
**Don't use `.pipe()`.

DO use `.pipeline()` because it does all the good things and has been available since node 10 or so.

### Mongoose

Instead of loading all query results into memory and processing them there, we'll use a cursor to process them and pass that cursor directly to fastify.

The `cursor()` lets you process query results one-at-a-time. The old `stream()` function was removed in 5.0. In the majority of cases, `cursor()` is a drop-in replacement for `stream()`. 

## Preconditions

### Node

Use the correct node version from [.nvmrc](.nvmrc) via nvm: `nvm use`

### MondoDb

A mongodb should be running on your machine.
One easy way is via docker: `docker run -p 27017:27017 --rm -d mongo:4.4.18`

Optionally, [install MongoDb Compass](https://www.mongodb.com/try/download/compass) to view your database.

## Usage

Start server: `npm run start` and then, via [httpie](https://httpie.io/) or cURL issues one of the actions below:

### CSV Stream

GET article csv `http GET "localhost:8080/articles?format=csv"` or open the url in your browser to download the file: http://localhost:8080/articles?format=csv&asFile=true

### Concatenate Stream

GET csv `http GET "localhost:8080/feed"`

### Map Stream

GET store `http GET "localhost:8080/store"`

## Created via

* `npm init -y`, [configure npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#private) by setting `"private": true` and engines to same node version as in the [.npmrc](.npmrc)
* `npm i fastify`
* `npm i -D typescript @types/node ts-node`
* `npm i mongoose @types/mongoose`
* `npx tsc --init` and configure `outdir: "dist"`, `"target": "es2017"` and other smaller things.
* `mkdir src && touch src/server.ts` and put code from [fastify TypeScript getting started](https://www.fastify.io/docs/latest/Reference/TypeScript/#getting-started).
* Add `"build": "tsc"` and `"start": "ts-node src/server.ts"` to [package.json](package.json).
