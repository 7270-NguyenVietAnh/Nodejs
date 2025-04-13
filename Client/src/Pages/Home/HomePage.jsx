import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { ContextFunction } from '../../Context/Context';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';
import CopyRight from '../../Components/CopyRight/CopyRight';

const HomePage = () => {
    const { setCart } = useContext(ContextFunction);
    const [categories, setCategories] = useState([]); // State để lưu danh sách categories
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    let authToken = localStorage.getItem('Authorization');

    useEffect(() => {
        getCategories(); // Lấy danh sách categories
        getProducts(); // Lấy danh sách sản phẩm
        window.scroll(0, 0);
    }, []);

    // Hàm lấy danh sách categories từ API
    const getCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/categories');
            console.log('Categories:', data);
            setCategories(data); // Lưu danh sách categories vào state
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Hàm lấy danh sách sản phẩm từ API
    const getProducts = async () => {
        try {
            if (authToken !== null) {
                const { data } = await axios.get('http://localhost:3000/products', {
                    headers: {
                        Authorization: authToken,
                    },
                });
                console.log('Products:', data);
                setProducts(data); // Lưu danh sách sản phẩm vào state
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <>
            <Container
                maxWidth="xl"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 0,
                    flexDirection: 'column',
                    marginBottom: 70,
                }}
            >
                <Box padding={1}>
                    <Carousel />
                </Box>
                <Container style={{ marginTop: 90, display: 'flex', justifyContent: 'center' }}>
                    <SearchBar />
                </Container>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        marginTop: 10,
                        color: '#1976d2',
                        fontWeight: 'bold',
                    }}
                >
                    Categories
                </Typography>
                <Container
                    maxWidth="xl"
                    style={{
                        marginTop: 90,
                        display: 'flex',
                        justifyContent: 'center',
                        flexGrow: 1,
                        flexWrap: 'wrap',
                        gap: 20,
                    }}
                >
                    {categories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            data={{
                                name: category.name,
                                img: category.img || 'https://via.placeholder.com/150', // Hiển thị ảnh mặc định nếu không có ảnh
                            }}
                        />
                    ))}
                </Container>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default HomePage;