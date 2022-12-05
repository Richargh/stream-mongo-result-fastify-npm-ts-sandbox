import {Transform} from "stream";
import {stringifyJson} from "../stringify/stringify-json";

export function stringifyAsJsonStream(): Transform {
    return new Transform({
        readableObjectMode: true,
        writableObjectMode: true, // Enables us to use object in chunk
        transform(chunk: unknown, encoding, callback) {
            this.push(stringifyJson(chunk));
            callback();
        },
    });
}