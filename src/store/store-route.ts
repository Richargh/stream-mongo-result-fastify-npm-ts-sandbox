import {FastifyInstance} from "fastify";
import {findAllPriceCategories, PriceCategory} from "../price/price-store";
import {Article, findAllArticles} from "../articles/article-store";
import {pipeline, Transform} from "stream";
import {logError} from "../commons/error/log";
import {stringifyAsJsonStream} from "../commons/stream/stringify-json-stream";

export function initStoreRoute(server: FastifyInstance) {
    server.get('/store', async (request, reply) => {
        const priceCategories: Map<string, PriceCategory>
            = new Map((await findAllPriceCategories()).map(it => [it.label, it]));

        const articleStream = findAllArticles();
        const joinedPriceStream = joinPrice(priceCategories);
        const jsonStream = stringifyAsJsonStream();
        const result = pipeline(articleStream, joinedPriceStream, jsonStream, logError);

        await reply
            .type('application/x-ndjson')
            .send(result);
    });
}

export function joinPrice(priceCategories: Map<string, PriceCategory>): Transform {
    return new Transform({
        readableObjectMode: true,
        writableObjectMode: true, // Enables us to use object in chunk
        transform(chunk: Article, encoding, callback) {
            const price = chunk.priceLabel != null
                ? priceCategories.get(chunk.priceLabel)?.price
                : undefined;
            if(price != null){
                const joinedArticle: Pick<Article, '_id' | 'title'> & {price: number}
                    = {_id: chunk._id, title: chunk.title, price: price}
                this.push(joinedArticle);
            }
            callback();
        }
    });
}
