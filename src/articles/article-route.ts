import {FastifyInstance} from "fastify";
import {Article, findAllArticles} from "./article-store";
import {stringify} from "csv-stringify";
import {Transform} from "stream";

const csvStream = stringify({
    header: true,
    columns: {
        id: 'ID',
        title: 'TITLE',
    }
});

const csvHandler = new Transform({
    readableObjectMode: true,
    writableObjectMode: true, // Enables us to use object in chunk
    transform(chunk: Article, encoding, callback) {
        const { _id, title } = chunk;
        const row = { id: _id, title };
        this.push(`${row.id}, ${row.title}\n`);

        callback();
    },
});

export function initArticleRoute(server: FastifyInstance) {
    server.get('/articles', async (request, reply) => {
        console.log("# Find articles");

        const data: string[] = [];
        const articles = findAllArticles()
            .pipe(csvHandler)
            .on('data', doc => { console.log(`Srvr: ${doc}`); data.push(doc) });

            // .on('data', doc => { console.log(doc); });
            // .pipe(reply.type('json));
        // console.log("GET articles");
        // articles.push(null);

        // reply.header('content-type', 'octet-stream');
        // reply.header('content-disposition', 'attachment; filename=JCI-reports.csv');



        await reply
            .header('Content-Type', 'application/octet-stream')
            .type('text/csv')
            .send(articles);

        articles.end()
        articles.destroy()
    });
}