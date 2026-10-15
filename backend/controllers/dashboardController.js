import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";

export const getDashboardAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({
            status: {
                $nin: ["Cancelled", "Refunded"]
            }
        }).lean();

        let grossSales = 0;

        orders.forEach((order) => {
            grossSales += Number(order.totalAmount || 0);
        });

        const totalOrders = orders.length;

        const averageOrderValue =
            totalOrders > 0 ? grossSales / totalOrders : 0;

        let unitsSold = 0;

        orders.forEach((order) => {
            const items = order.items || [];

            items.forEach((item) => {
                unitsSold += Number(item.quantity || 0);
            });
        });

        const brandCount = {};

        for (const order of orders) {
            const items = order.items || [];

            for (const item of items) {
                if (!item.product) {
                    continue;
                }

                const product = await Product.findById(item.product).lean();

                if (!product) {
                    continue;
                }

                const brand = product.brand;

                if (!brand) {
                    continue;
                }

                if (!brandCount[brand]) {
                    brandCount[brand] = 0;
                }

                brandCount[brand] += Number(item.quantity || 0);
            }
        }

        let topBrand = null;
        let highestBrandUnits = 0;

        for (const brand in brandCount) {
            if (brandCount[brand] > highestBrandUnits) {
                highestBrandUnits = brandCount[brand];
                topBrand = brand;
            }
        }

        const products = await Product.find().lean();

        let lowStockSKU = 0;
        let outOfStockSKU = 0;

        products.forEach((product) => {
            const variants = product.variants || [];

            variants.forEach((variant) => {
                const stock = Number(variant.stock || 0);

                if (stock > 0 && stock <= 10) {
                    lowStockSKU++;
                }

                if (stock === 0) {
                    outOfStockSKU++;
                }
            });
        });

        const totalCustomers = await User.countDocuments();

        const coupons = await Coupon.find().lean();

        let activeCoupons = 0;
        let totalCouponUsage = 0;

        coupons.forEach((coupon) => {
            if (coupon.status === "active") {
                activeCoupons++;
            }

            totalCouponUsage += Number(coupon.usedCount || 0);
        });

        return res.status(200).json({
            message: "Dashboard Analytics",
            analytics: {
                grossSales: grossSales,
                totalOrders: totalOrders,
                averageOrderValue: Number(
                    averageOrderValue.toFixed(2)
                ),
                unitsSold: unitsSold,
                topBrand: topBrand,
                lowStockSKU: lowStockSKU,
                outOfStockSKU: outOfStockSKU,
                totalCustomers: totalCustomers,
                couponPerformance: {
                    totalCoupons: coupons.length,
                    activeCoupons: activeCoupons,
                    totalCouponUsage: totalCouponUsage
                }
            }
        });
    } catch (error) {
        console.error("Dashboard Analytics Error:", error);

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};