const express = require('express');
const router = express.Router();
const Order = require('../schemas/order'); // Schema cho đơn hàng
const Product = require('../schemas/product'); // Schema cho sản phẩm
const { check_authentication } = require('../utils/check_auth'); // Import middleware

router.post('/create-order', check_authentication, async (req, res) => {
    try {
        const { amount, productDetails, userDetails } = req.body;
        const userId = req.user.id; // Lấy userId từ middleware

        // Debug dữ liệu nhận được từ frontend
        console.log('Request Body:', req.body);
        console.log('User ID:', userId);

        // Kiểm tra nếu userId không tồn tại
        if (!userId) {
            return res.status(400).send({
                success: false,
                message: 'User ID is required',
            });
        }

        // Lưu thông tin đơn hàng vào cơ sở dữ liệu
        const newOrder = new Order({
            userId,
            amount,
            productDetails: JSON.parse(productDetails),
            userDetails: JSON.parse(userDetails),
            status: 'Pending', // Trạng thái mặc định
        });

        await newOrder.save();

        // Trả về phản hồi thành công
        res.status(200).send({
            success: true,
            message: 'Order created successfully',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error creating order:', error); // In lỗi chi tiết
        res.status(500).send({
            success: false,
            message: 'Failed to create order',
        });
    }
});

router.get('/ordered-users', check_authentication, async (req, res) => {
    try {
        // Lấy danh sách đơn hàng và populate thông tin người dùng và sản phẩm
        const orders = await Order.find()
            .populate('userId', 'username email address city zipCode userState')
            .populate('productDetails.productId', 'name imgURL'); // Populate thông tin sản phẩm

        if (orders.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No orders found',
            });
        }

        // Nhóm đơn hàng theo người dùng
        const groupedOrders = orders.reduce((acc, order) => {
            const userId = order.userId._id.toString();
            if (!acc[userId]) {
                acc[userId] = {
                    userDetails: order.userId,
                    orders: [],
                };
            }
            acc[userId].orders.push({
                orderId: order._id,
                amount: order.amount,
                products: order.productDetails.map((product) => ({
                    productId: product.productId._id,
                    name: product.productId.name,
                    imgURL: product.productId.imgURL,
                    quantity: product.quantity,
                })),
                createdAt: order.createdAt,
            });
            return acc;
        }, {});

        res.status(200).send({
            success: true,
            message: 'Users and orders fetched successfully',
            data: Object.values(groupedOrders),
        });
    } catch (error) {
        console.error('Error fetching ordered users:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch ordered users',
        });
    }
});

module.exports = router;