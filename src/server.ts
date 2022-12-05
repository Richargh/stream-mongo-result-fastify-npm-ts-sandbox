import {startFastify} from "./start/fastify";
import {connectMongoose} from "./start/mongoose";
import {putArticle} from "./articles/article-store";
import {putPin} from "./pins/pin-store";

export async function start(): Promise<void> {
    await connectMongoose();
    startFastify();
}

async function initArticles(count: number) {
    for (let i = 0; i < count; i++) {
        await putArticle({_id: i.toString().padStart(32, '0'), title: `Article ${i}`});
    }
}

async function initPins(count: number) {
    for (let i = 0; i < count; i++) {
        await putPin({_id: i.toString().padStart(32, '0'), title: `Pin ${i}`});
    }
}

start()
    .then(() => initArticles(10))
    .then(() => initPins(5))
    .then(() => "Initialized Data");
