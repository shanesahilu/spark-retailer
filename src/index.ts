import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Product } from "../database/product.model.js";
import { Supplier } from "../database/supplier.model.js";
import { Inventory } from "../database/inventory.model.js";
import { connectToDatabase } from "../lib/mongoose.js";

const app = new Hono()

// --- Specific routes are defined before dynamic routes ---

// Search for an inventory item by product name
app.get('/inventory/search/:productName', async (c) => {
  const { productName } = c.req.param();
  try {
    await connectToDatabase();
    const product = await Product.findOne({ name: { $regex: new RegExp(productName, "i") } });

    if (!product) {
      return c.json({ error: 'Product not found with that name.' }, 404);
    }

    const inventoryItem = await Inventory.findOne({ productId: product._id }).populate('productId').populate('supplierId');
    
    if (!inventoryItem) {
      return c.json({ error: 'Inventory details not found for this product.' }, 404);
    }
    
    return c.json(inventoryItem);
  } catch (error) {
    return c.json({ error: 'Failed to search for inventory item' }, 500);
  }
});

// Get all products that are low in stock
app.get('/inventory/lowstock', async (c) => {
  try {
    await connectToDatabase();
    const lowStockItems = await Inventory.find({ $expr: { $lt: ["$quantity", "$reorderLevel"] } }).populate('productId');
    if (!lowStockItems || lowStockItems.length === 0) {
        return c.json({ message: "No items are currently low on stock." });
    }
    return c.json(lowStockItems);
  } catch (error) {
    return c.json({ error: 'Failed to fetch low stock items' }, 500);
  }
});

// Get stock level for a specific product SKU
app.get('/inventory/:sku', async (c) => {
  const { sku } = c.req.param();
  try {
    await connectToDatabase();
    const inventoryItem = await Inventory.findOne({ sku }).populate('productId').populate('supplierId');
    if (!inventoryItem) {
      return c.json({ error: 'Inventory item not found for that SKU' }, 404);
    }
    return c.json(inventoryItem);
  } catch (error) {
    return c.json({ error: 'Failed to fetch inventory item' }, 500);
  }
});

// Update the quantity of an inventory item
app.put('/inventory/:sku', async (c) => {
    const { sku } = c.req.param();
    const { quantity } = await c.req.json();

    if (typeof quantity !== 'number' || quantity < 0) {
        return c.json({ error: 'Invalid quantity value' }, 400);
    }

    try {
        await connectToDatabase();
        const updatedInventory = await Inventory.findOneAndUpdate(
            { sku },
            { quantity, lastRestocked: new Date() },
            { new: true }
        );

        if (!updatedInventory) {
            return c.json({ error: 'Inventory item not found' }, 404);
        }

        return c.json(updatedInventory);
    } catch (error) {
        return c.json({ error: 'Failed to update inventory' }, 500);
    }
});

// Get all products
app.get('/products', async (c) => {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return c.json(products);
  } catch (error) {
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// NEW: Get all suppliers
app.get('/suppliers', async (c) => {
  try {
    await connectToDatabase();
    const suppliers = await Supplier.find({});
    if (!suppliers || suppliers.length === 0) {
        return c.json({ message: "No suppliers found." });
    }
    return c.json(suppliers);
  } catch (error) {
    return c.json({ error: 'Failed to fetch suppliers' }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 4000
}, (info) => {
  console.log(`Retailer API server is running on http://localhost:${info.port}`)
})