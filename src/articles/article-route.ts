import {FastifyInstance} from "fastify";

export function initArticleRoute(server: FastifyInstance) {
    server.get('/articles', async (request, reply) => {
        return 'articles\n'
    });
}