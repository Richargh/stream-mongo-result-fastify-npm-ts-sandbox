import {FastifyInstance} from "fastify";
import {findAllArticles} from "../articles/article-store";
import {findAllPins} from "../pins/pin-store";
import {concatenate} from "../commons/stream/concatenate";

export function initFeedRoute(server: FastifyInstance) {

    server.get('/feed', async (request, reply) => {
        const someUserId = '123';
        const pinStream = findAllPins(someUserId, {stringify: true});
        const articleStream = findAllArticles({stringify: true});

        // NOTE: the order of pins and articles is non-deterministic
        const combinedStream = concatenate(pinStream, articleStream);

        await reply
            .type('application/x-ndjson')
            .send(combinedStream);
    });
}