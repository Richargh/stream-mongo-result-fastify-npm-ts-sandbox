import {startFastify} from "./start/fastify";
import {connectMongoose} from "./start/mongoose";
import {putArticle} from "./articles/article-store";

export async function start(): Promise<void> {
    await connectMongoose();
    startFastify();
}

async function initArticles(count: number) {
    for (let i = 0; i < count; i++) {
        await putArticle({_id: i.toString().padStart(32, '0'), title: `Article ${i}`});
    }
}

start()
    .then(() => initArticles(10))
    .then(() => "Initialized Data");
