import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try{
        const { name, description, brand, category, variants, sku, mrp, costPrice, sellingPrice } = req.body;
        if(!name || !description || !brand || !category || !variants || !sku ||!mrp || !costPrice || !sellingPrice){
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const product = new Product({
            name,
            description,
            brand,
            category,
            variants,
            sku,
            mrp,
            costPrice,
            sellingPrice
        });
        const createdProduct = await product.save();
        return res.status(201).json({
            message: "Product Created Successfully",
            product: createdProduct
        });
    }catch(error){
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

export const getProducts = async (req, res) => {
    try{
    const products = await Product.find().sort({ createdAt: -1 })
        return res.status(200).json({
            message: "Products",
            products: products
        });
}catch(error){
    return res.status(500).json({
        message: "Server Error"
    });
}
}

export const getProductById = async(req, res) => {
    try{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            message: "Product not found",
        });
    }
        return res.status(200).json({
            message: "Product",
            product: product
        });
    }catch(error){
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export const updateProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const {
    name,
    description,
    brand,
    category,
    variants,
    sku,
    mrp,
    sellingPrice,
    costPrice
} = req.body;

if (name !== undefined) product.name = name;
if (description !== undefined) product.description = description;
if (brand !== undefined) product.brand = brand;
if (category !== undefined) product.category = category;
if (variants !== undefined) product.variants = variants;
if (sku !== undefined) product.sku = sku;
if (mrp !== undefined) product.mrp = mrp;
if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
if (costPrice !== undefined) product.costPrice = costPrice;

        const updateProduct = await product.save();
        return res.status(200).json({
            message: "Product Updated Successfully",
            product: updateProduct
        });
    }catch(error){
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { sku, stock } = req.body;

        const product = await Product.findOne({
            "variants.sku": sku
        });

        if (!product) {
            return res.status(404).json({
                message: "Product or SKU not found"
            });
        }

        const variant = product.variants.find(
            (item) => item.sku === sku
        );

        if (!variant) {
            return res.status(404).json({
                message: "Variant not found"
            });
        }

        variant.stock = stock;

        const updatedProduct = await product.save();

        return res.status(200).json({
            message: "Stock updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        });
    }
};