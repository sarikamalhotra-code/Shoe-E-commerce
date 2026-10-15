import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    collection: {
        type: String
    },

    images: [{
        type: String
    }],

    variants: [variantSchema],

    sku: {
        type: String,
        required: true,
        unique: true
    },

    barcode: {
        type: String
    },

    mrp: {
        type: Number,
        required: true
    },

    sellingPrice: {
        type: Number,
        required: true
    },

    costPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["active", "archived"],
        default: "active"
    },

    seoTitle: {
        type: String
    },

    seoDescription: {
        type: String
    },

    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]

}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;