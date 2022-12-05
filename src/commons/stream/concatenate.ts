import {PassThrough, Stream} from "stream";

export function concatenate(...streams: Stream[]): PassThrough {
    let passThrough = new PassThrough()
    let waiting = streams.length
    for (let stream of streams) {
        passThrough = stream.pipe(passThrough, {end: false})
        stream.once('end', () => --waiting === 0 && passThrough.emit('end'))
    }
    return passThrough
}