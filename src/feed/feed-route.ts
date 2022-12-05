import {FastifyInstance} from "fastify";
import {findAllArticles} from "../articles/article-store";
import {findAllPins} from "../pins/pin-store";
import {PassThrough, Stream} from "stream";

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

    function concatenate(...streams: Stream[]): PassThrough {
        let passThrough = new PassThrough()
        let waiting = streams.length
        for (let stream of streams) {
            passThrough = stream.pipe(passThrough, {end: false})
            stream.once('end', () => --waiting === 0 && passThrough.emit('end'))
        }
        return passThrough
    }
}