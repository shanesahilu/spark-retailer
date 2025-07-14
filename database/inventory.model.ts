import { Schema, model, Document } from 'mongoose';

export interface IInventory extends Document {
    productId: Schema.Types.ObjectId;
    sku: string;
    quantity: number;
    reorderLevel: number;
    costPrice: number;
    location: string;
    supplierId: Schema.Types.ObjectId;
    lastRestocked: Date;
}

const inventorySchema = new Schema<IInventory>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    reorderLevel: { type: Number, required: true, default: 10 },
    costPrice: { type: Number, required: true },
    location: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    lastRestocked: { type: Date, default: Date.now },
});

export const Inventory = model<IInventory>('Inventory', inventorySchema);
