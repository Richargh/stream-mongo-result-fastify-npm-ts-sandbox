import {startFastify} from "./start/fastify";
import {connectMongoose} from "./start/mongoose";
import {putArticle} from "./articles/article-store";
import {putPin} from "./pins/pin-store";
import {putPriceCategory} from "./price/price-store";

export async function start(): Promise<void> {
    await connectMongoose();
    startFastify();
}

async function initArticles(count: number) {
    await Promise.all([
        putPriceCategory({_id: "0".padStart(32, '0'), label: 'cheap', price: 1}),
        putPriceCategory({_id: "1".padStart(32, '0'), label: 'moderate', price: 5}),
        putPriceCategory({_id: "2".padStart(32, '0'), label: 'expensive', price: 20})
    ])

    await Promise.all(
        Array.from({ length: 10 }, (_, i) => i)
            .map(id => putArticle({
                _id: id.toString().padStart(32, '0'),
                title: `Article ${id}`,
                priceLabel: id < 3 ? undefined : id < 6 ? 'cheap' : id < 8 ? 'moderate' : 'expensive'
            }))
    );
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
