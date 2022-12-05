import {model, Schema} from "mongoose";

export type PriceCategory = {
    _id: string;
    label: string;
    price: number;
}

const priceCategorySchema = new Schema<PriceCategory>({
    _id: { type: String, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true },
});

const ActivePriceCategory = model<PriceCategory>('PriceCategory', priceCategorySchema);

/**
 * Create or update article
 * @param priceCategory
 */
export async function putPriceCategory(priceCategory: PriceCategory): Promise<void> {
    await ActivePriceCategory.updateOne({_id: priceCategory._id}, priceCategory, {upsert: true});
}

export async function findAllPriceCategories(): Promise<PriceCategory[]> {
    return ActivePriceCategory
        .find()
        .lean();
}