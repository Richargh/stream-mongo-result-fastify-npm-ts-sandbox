import {FastifyInstance} from "fastify";
import {findAllArticles} from "./article-store";
import {stringify} from "csv-stringify";
import {pipeline, Readable, Stream, Transform} from "stream";
import {logError} from "../commons/error/log";
import {stringifyAsJsonStream} from "../commons/stream/stringify-json-stream";

export function initArticleRoute(server: FastifyInstance) {

    enum Format {
        Csv = 'csv'
    }

    interface ArticleQuerystring {
        format?: Format;
        asFile?: boolean;
    }

    function stringifyArticleAsCsvStream(): Transform {
        return stringify({
            header: true,
            columns: {
                _id: 'ID',
                title: 'TITLE'
            }
        });
    }

    server.get<{Querystring: ArticleQuerystring}>('/articles', async (request, reply) => {
        const { format, asFile } = request.query;
        console.log(`Query format=${format}, isCsv=${format === Format.Csv} asFile=${asFile}`);

        const mimeType = format === Format.Csv
            ? 'text/csv'
            : 'application/x-ndjson';
        const fileExt = format === Format.Csv
            ? 'csv'
            : 'json';
        const contentType = asFile
            ? 'application/octet-stream'
            : mimeType;
        const contentDisposition = asFile
            ? `attachment; filename=articles.${fileExt}`
            : null;

        const articleStream = findAllArticles();
        let result: Stream;
        if(format === Format.Csv){
            // create the stream here to avoid memory leaks
            const csvStream = stringifyArticleAsCsvStream();
            result = pipeline(articleStream, csvStream, logError);
        } else {
            const jsonStream = stringifyAsJsonStream();
            result = pipeline(articleStream, jsonStream, logError);
        }

        reply.header('Content-Type', contentType);
        if(contentDisposition != null) reply.header('content-disposition', contentDisposition);
        await reply.send(result);
    });
}