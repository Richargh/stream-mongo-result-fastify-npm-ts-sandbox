import fastify from "fastify";
import {initArticleRoute} from "../articles/article-route";
import {initPeopleRoute} from "../people/people-route";

export function startFastify(){
    const server = fastify();

    initPeopleRoute(server);
    initArticleRoute(server);

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}