import { Schema, model, HydratedDocument } from 'mongoose';
import {Stringifier, stringify} from "csv-stringify";
import {pipeline, Readable} from "stream";

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

export async function findAllArticles(): Promise<Readable> {
    return ActiveArticle
        .find()
        .cursor({transform: JSON.stringify})
        .on('data', doc => { console.log(`Store found ${doc}`); });
}

async function generateReport(){
    let articleCursor = ActiveArticle
        .find({active:true})
        .cursor({transform: (article: HydratedDocument<Article>) =>{
            const {_id:id, title} = article.toObject()
            return {id, title}
        }});

    //create object to csv transformer
    let csvStream = stringify({
        header: true,
        columns: {
            title: 'TITLE',
        }
    });

    const bla: Stringifier = pipeline(articleCursor, csvStream)
}