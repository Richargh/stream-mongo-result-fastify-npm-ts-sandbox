import {FastifyInstance} from "fastify";
import {findAllArticles} from "./article-store";

export function initArticleRoute(server: FastifyInstance) {
    server.get('/articles', async (request, reply) => {
        const articles = findAllArticles();
            // .on('data', doc => { console.log(doc); });
            // .pipe(reply.type('json));
        // console.log("GET articles");
        reply.send(articles);
    });
}