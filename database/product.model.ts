import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    productId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
}

const productSchema = new Schema<IProduct>({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
});

export const Product = model<IProduct>('Product', productSchema);
