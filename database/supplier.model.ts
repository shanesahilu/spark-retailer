import { Schema, model, Document } from 'mongoose';

export interface Supplier extends Document {
    supplierId: string;
    name: string;
    contact: {
        phone: string;
        email: string;
    };
    address: string;
}

const supplierSchema = new Schema<Supplier>({
    supplierId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    address: { type: String, required: true },
});

export const Supplier = model<Supplier>('Supplier', supplierSchema);
