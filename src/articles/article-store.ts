import { Schema, model } from 'mongoose';
import {Readable} from "stream";
import {jsonStringify} from "../commons/stringify/json-stringify";

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

// TODO add type hints
export function findAllArticles(options?: ArticleQueryOptions): Readable {

    return  ActiveArticle
        .find()
        .lean()
        .cursor(options?.stringify ? {transform: jsonStringify} : undefined);
}

export type ArticleQueryOptions = {
    stringify: boolean
}

// TODO add change streams
