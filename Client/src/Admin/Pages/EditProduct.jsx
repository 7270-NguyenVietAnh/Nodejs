import React, { useEffect, useState } from 'react';
import {
    TextField, Button, Container, Typography, MenuItem,
    Select, FormControl, InputLabel, Box, Paper, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productInfo, setProductInfo] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        imgURL: '',
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3000/products/${id}`);
            setProductInfo({
                name: data.data.name,
                price: data.data.price,
                quantity: data.data.quantity,
                description: data.data.description,
                imgURL: data.data.imgURL,
                category: data.data.category._id,
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to fetch product details.');
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductInfo({ ...productInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProductInfo({ ...productInfo, imgURL: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', productInfo.name);
            formData.append('price', productInfo.price);
            formData.append('quantity', productInfo.quantity);
            formData.append('description', productInfo.description);
            formData.append('category', productInfo.category);
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await axios.put(`http://localhost:3000/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Product updated successfully!');
                navigate(-1);
            } else {
                throw new Error(response.data.message || 'Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Edit Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={productInfo.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={productInfo.price}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={productInfo.quantity}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={productInfo.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Current Image:
                        </Typography>
                        <img
                            src={`http://localhost:3000${encodeURI(productInfo.imgURL)}`}
                            alt="Product"
                            style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: 8 }}
                        />
                    </Box>
                    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                        Upload New Image
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            name="category"
                            value={productInfo.category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditProduct;
