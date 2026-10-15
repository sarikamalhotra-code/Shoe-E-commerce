import Coupon from "../models/Coupon.js";

// Create Coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minimumOrderValue, maximumDiscount, startDate, endDate, usageLimit } = req.body;

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase()
        });

        if (existingCoupon) {
            return res.status(400).json({
                message: "Coupon code already exists"
            });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minimumOrderValue,
            maximumDiscount,
            startDate,
            endDate,
            usageLimit
        });

        return res.status(201).json({
            message: "Coupon created successfully",
            coupon
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Get All Coupons
export const getAllCoupons = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};

        if (status) {
            filter.status = status;
        }

        const coupons = await Coupon.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All Coupons",
            coupons
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Get Coupon By ID
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            message: "Coupon Details",
            coupon
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCoupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            message: "Coupon updated successfully",
            coupon: updatedCoupon
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCoupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            message: "Coupon deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Apply / Validate Coupon
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase()
        });

        if (!coupon) {
            return res.status(404).json({
                message: "Invalid coupon code"
            });
        }

        if (coupon.status !== "active") {
            return res.status(400).json({
                message: "Coupon is inactive"
            });
        }

        const currentDate = new Date();

        if (
            currentDate < coupon.startDate ||
            currentDate > coupon.endDate
        ) {
            return res.status(400).json({
                message: "Coupon has expired or is not active yet"
            });
        }

        if (
            coupon.usageLimit &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return res.status(400).json({
                message: "Coupon usage limit reached"
            });
        }

        if (orderAmount < coupon.minimumOrderValue) {
            return res.status(400).json({
                message: `Minimum order value is ${coupon.minimumOrderValue}`
            });
        }

        let discount = 0;

        if (coupon.discountType === "percentage") {
            discount = (orderAmount * coupon.discountValue) / 100;

            if (
                coupon.maximumDiscount &&
                discount > coupon.maximumDiscount
            ) {
                discount = coupon.maximumDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        const finalAmount = orderAmount - discount;

        return res.status(200).json({
            message: "Coupon applied successfully",
            couponCode: coupon.code,
            discount,
            finalAmount
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};