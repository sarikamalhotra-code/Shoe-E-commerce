import User from "../models/User.js";
import Order from "../models/Order.js";

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All Customers",
            customers: customers
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const searchCustomers = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const searchText = search.trim();

        const customers = await User.find({
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { fullName: { $regex: searchText, $options: "i" } },
                { email: { $regex: searchText, $options: "i" } }
            ]
        })
        .select("-password")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Customers found",
            customers: customers
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id)
            .select("-password");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer Details",
            customer: customer
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.params.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Customer Order History",
            orders: orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};