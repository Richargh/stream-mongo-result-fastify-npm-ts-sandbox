import { Schema, model, HydratedDocument } from 'mongoose';
import {Stringifier, stringify} from "csv-stringify";
import {pipeline, Readable, Transform} from "stream";

export type Article = {
    _id: string;
    title: string;
}

const articleSchema = new Schema<Article>({
    _id: { type: String, required: true },
    title: { type: String, required: true }
});

const ActiveArticle = model<Article>('User', articleSchema);

/**
 * Create or update article
 * @param article
 */
export async function putArticle(article: Article): Promise<void> {
    await ActiveArticle.updateOne({_id: article._id}, article, {upsert: true});
}

export function findAllArticles(): Readable {
    return  ActiveArticle
        .find()
        .lean()
        .cursor();
}
