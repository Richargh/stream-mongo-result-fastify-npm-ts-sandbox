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


const streamHandler = new Transform({
    readableObjectMode: true,
    writableObjectMode: true, // Enables us to use object in chunk
    transform(chunk: Article, encoding, callback) {
        const { _id, title } = chunk;
        const row = { id: _id, title };
        this.push(row);

        callback();
    },
});

export function findAllArticles(): Readable {
    const cursor = ActiveArticle
        .find()
        .cursor()
        // .on('data', doc => { console.log(`Store found: ${doc}`); })
        .on('end', () => { console.log(`Destroying cursor`); cursor.close(); cursor.destroy() });

    // const data = [];
    // for await (const doc of cursor) {
    //     console.log(`Found row: ${doc}`);
    //     data.push(doc);
    // }

    return cursor
        .map((doc) => {
            return doc;
        })
        .pipe(streamHandler)
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
            title: 'TITLE'
        }
    });

    const bla: Stringifier = pipeline(articleCursor, csvStream)
}
