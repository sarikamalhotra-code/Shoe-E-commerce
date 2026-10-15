import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

// Update Inventory
export const updateInventory = async (req, res) => {
    try {
        const { sku, newStock, type, reason } = req.body;

        // Find product using variant SKU
        const product = await Product.findOne({
            "variants.sku": sku
        });

        if (!product) {
            return res.status(404).json({
                message: "Product variant not found"
            });
        }

        // Find exact variant
        const variant = product.variants.find(
            (item) => item.sku === sku
        );

        if (!variant) {
            return res.status(404).json({
                message: "Variant not found"
            });
        }

        // Store old stock
        const previousStock = variant.stock;

        // Update product stock
        variant.stock = newStock;

        await product.save();

        // Create inventory ledger entry
        const inventory = await Inventory.create({
            product: product._id,
            sku: sku,
            previousStock: previousStock,
            newStock: newStock,
            quantity: Math.abs(newStock - previousStock),
            type: type,
            reason: reason
        });

        return res.status(200).json({
            message: "Inventory updated successfully",
            product,
            inventory
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Get Inventory History
export const getInventoryHistory = async (req, res) => {
    try {
        const { sku } = req.query;

        let filter = {};

        if (sku) {
            filter.sku = sku;
        }

        const inventory = await Inventory.find(filter)
            .populate("product", "name brand category")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Inventory history",
            inventory
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Get Low Stock Products
export const getLowStockProducts = async (req, res) => {
    try {
        const threshold = Number(req.query.threshold) || 10;

        const products = await Product.find({
            "variants.stock": {
                $lte: threshold
            }
        });

        return res.status(200).json({
            message: "Low stock products",
            threshold,
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};