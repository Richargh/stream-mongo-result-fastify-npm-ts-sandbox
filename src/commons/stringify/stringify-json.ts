import {Transform} from "stream";

export function stringifyJson(value: unknown){
    return JSON.stringify(value) + '\n';
}

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