import mongoose from "mongoose";
import { connectToDatabase } from "../mongoose.js";
import { Product } from "../../database/product.model.js";
import { Supplier } from "../../database/supplier.model.js";
import { Inventory } from "../../database/inventory.model.js";
import { products as productData } from "./products.js";
import { suppliers as supplierData } from "./suppliers.js";

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully. Starting to seed data...");

    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Inventory.deleteMany({});
    console.log("Cleared existing data.");

    const seededSuppliers = await Supplier.insertMany(supplierData);
    console.log(`${seededSuppliers.length} suppliers have been added.`);

    const seededProducts = await Product.insertMany(productData);
    console.log(`${seededProducts.length} products have been added.`);
    
    const inventoryItems = [
        {
            productId: seededProducts[0]._id,
            sku: "NTG-P1-BLK-128-SKU",
            quantity: 47,
            reorderLevel: 15,
            costPrice: 28999.3,
            location: "WH-A2",
            supplierId: seededSuppliers[0]._id,
        },
        {
            productId: seededProducts[1]._id,
            sku: "SHOE001-SKU",
            quantity: 8,
            reorderLevel: 10,
            costPrice: 12000,
            location: "WH-B5",
            supplierId: seededSuppliers[1]._id,
        },
        {
            productId: seededProducts[2]._id,
            sku: "HEALTH001-SKU",
            quantity: 150,
            reorderLevel: 25,
            costPrice: 4500,
            location: "WH-C1",
            supplierId: seededSuppliers[2]._id,
        },
        {
            productId: seededProducts[3]._id,
            sku: "SAM-S24U-TIB-256-SKU",
            quantity: 5,
            reorderLevel: 10,
            costPrice: 110000,
            location: "WH-A3",
            supplierId: seededSuppliers[0]._id,
        }
    ];

    await Inventory.insertMany(inventoryItems);
    console.log(`${inventoryItems.length} inventory items have been added.`);


    console.log("Database seeding completed successfully! 🎉");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  }
};

seedDatabase();
