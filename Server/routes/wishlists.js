const express = require('express');
const router = express.Router();
const { check_authentication } = require('../utils/check_auth');
const Wishlist = require('../schemas/wishlist'); // Giả sử bạn có schema Wishlist
const Product = require('../schemas/product'); // Giả sử bạn có schema Product

// API: Lấy danh sách Wishlist
router.get('/', check_authentication, async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
        if (!wishlist) {
            return res.status(200).json([]);
        }
        res.status(200).json(wishlist.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API: Thêm sản phẩm vào Wishlist
router.post('/add', check_authentication, async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const existingItem = wishlist.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlist.items.push({ productId });
        await wishlist.save();

        res.status(200).json({ message: 'Product added to wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API: Xóa sản phẩm khỏi Wishlist
router.delete('/remove/:id', check_authentication, async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter((item) => item.productId.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;