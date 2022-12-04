import {FastifyInstance} from "fastify";
import {findAllArticles} from "./article-store";
import {stringify} from "csv-stringify";

const csvStream = stringify({
    header: true,
    columns: {
        id: 'ID',
        title: 'TITLE',
    }
});

export function initArticleRoute(server: FastifyInstance) {
    server.get('/articles', async (request, reply) => {
        const articles = await findAllArticles()
            .pipe(csvStream)
            .on('end', () => { console.log('ended'); });
            // .on('data', doc => { console.log(doc); });
            // .pipe(reply.type('json));
        // console.log("GET articles");
        // articles.push(null);

        return reply
            .type('text/csv')
            .send(articles);
    });
}