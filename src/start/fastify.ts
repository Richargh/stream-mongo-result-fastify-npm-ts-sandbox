import fastify from "fastify";
import {initArticleRoute} from "../articles/article-route";
import {initPeopleRoute} from "../people/people-route";
import {initFeedRoute} from "../feed/feed-route";
import {initStoreRoute} from "../store/store-route";

export function startFastify(){
    const server = fastify();

    initPeopleRoute(server);
    initArticleRoute(server);
    initFeedRoute(server);
    initStoreRoute(server);

    server.setErrorHandler(function (error, request, reply) {
        console.error(error);
    })

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}