const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cart'); // Giả sử bạn có model Cart
const Product = require('../schemas/product'); // Giả sử bạn có model Product
const { check_authentication } = require('../utils/check_auth');

router.get('/', check_authentication, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            
            return res.status(200).json([]);
        }
       
        res.status(200).json(cart.items);

    } catch (error) {
       
        console.error(error);

        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/check', check_authentication, async (req, res) => {
    try {

      
        const carts = await Cart.find().populate('userId'); // Populate để lấy thông tin người dùng
        console.log(carts, "dsadsds");
        res.status(200).json(carts);

    } catch (error) {
       
        console.error(error);

        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/add', check_authentication, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete('/remove/:id', check_authentication, async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;