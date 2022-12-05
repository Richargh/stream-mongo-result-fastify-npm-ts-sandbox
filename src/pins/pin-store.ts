import {model, Schema} from "mongoose";
import {Readable} from "stream";
import {jsonStringify} from "../commons/stringify/json-stringify";

export type Pin = {
    _id: string;
    title: string;
}

const pinSchema = new Schema<Pin>({
    _id: { type: String, required: true },
    title: { type: String, required: true }
});

const ActivePin = model<Pin>('Pin', pinSchema);

/**
 * Create or update pin
 * @param pin
 */
export async function putPin(pin: Pin): Promise<void> {
    await ActivePin.updateOne({_id: pin._id}, pin, {upsert: true});
}

// TODO add type hints
export function findAllPins(userId: string, options?: PinQueryOptions): Readable {
    return ActivePin
        .find()
        .lean()
        .cursor(options?.stringify ? {transform: jsonStringify} : undefined);
}

export type PinQueryOptions = {
    stringify: boolean
}