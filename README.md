# Stream Mongo Results to Fastify Route (Sandbox)

Shows how to stream query results from your mongodb to fastify reply with minimal memory allocation involved. See [article-route](src/articles/article-route.ts) and [article-store](src/articles/article-store.ts) for details.

## Features

* Fastify + TypeScript
* MongoDb + Mongoose

### Core Concepts

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

* Start server: `npm run start` and then, via [httpie](https://httpie.io/) or cURL:
    * GET csv `http GET "localhost:8080/articles?format=csv"`

## Created via

* `npm init -y`, [configure npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#private) by setting `"private": true` and engines to same node version as in the [.npmrc](.npmrc)
* `npm i fastify`
* `npm i -D typescript @types/node ts-node`
* `npm i mongoose @types/mongoose`
* `npx tsc --init` and configure `outdir: "dist"`, `"target": "es2017"` and other smaller things.
* `mkdir src && touch src/server.ts` and put code from [fastify TypeScript getting started](https://www.fastify.io/docs/latest/Reference/TypeScript/#getting-started).
* Add `"build": "tsc"` and `"start": "ts-node src/server.ts"` to [package.json](package.json).
