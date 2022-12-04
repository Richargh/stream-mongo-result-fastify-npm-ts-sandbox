import {connect} from "mongoose";

const database = 'test';

export async function connectMongoose() {
    await connect(`mongodb://localhost:27017/${database}`);
}