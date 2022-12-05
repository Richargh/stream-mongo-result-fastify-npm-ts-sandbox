import {FastifyInstance} from "fastify";
import {findAllArticles} from "./article-store";
import {stringify} from "csv-stringify";
import {pipeline, Readable, Transform, Writable} from "stream";
import {logError} from "../commons/error/log";

export function initArticleRoute(server: FastifyInstance) {

    server.get('/articles', async (request, reply) => {
        // create the stream here to avoid memory leaks
        const csvStream = stringify({
            header: true,
            columns: {
                _id: 'ID',
                title: 'TITLE'
            }
        });

        const articleStream = findAllArticles();
        const result = pipeline(articleStream, csvStream, logError);

        await reply
            .header('Content-Type', 'application/octet-stream')
            .header('content-disposition', 'attachment; filename=articles.csv')
            .send(result);
    });
}