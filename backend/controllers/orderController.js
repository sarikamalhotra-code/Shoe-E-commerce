 import Order from '../models/Order.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Only fetch orders belonging to the logged-in user
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//getAllOrders

export const getAllOrders = async (req, res) => {
    try {
        const { status, search } = req.query;

        let filter = {};

        // Filter by order status
        if (status) {
            filter.status = status;
        }

        let orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        // Search by customer name/email
        if (search) {
            const searchText = search.toLowerCase();

            orders = orders.filter((order) =>
                order.user &&
                (
                    order.user.name?.toLowerCase().includes(searchText) ||
                    order.user.email?.toLowerCase().includes(searchText)
                )
            );
        }

        return res.status(200).json({
            message: "All Orders",
            orders: orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true, runValidators: false }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const getAdminOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order Details",
            order: order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};