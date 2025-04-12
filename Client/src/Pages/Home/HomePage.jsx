import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { ContextFunction } from '../../Context/Context'
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import BannerData from '../../Helpers/HomePageBanner';
import Carousel from '../../Components/Carousel/Carousel'
import SearchBar from '../../Components/SearchBar/SearchBar'
import CopyRight from '../../Components/CopyRight/CopyRight'
const HomePage = () => {
    const { setCart } = useContext(ContextFunction);
    const [products, setProducts] = useState([]); // State để lưu sản phẩm
    let authToken = localStorage.getItem('Authorization');

    useEffect(() => {
        getProducts();
        window.scroll(0, 0);
    }, []);

    const getProducts = async () => {
        try {
            if (authToken !== null) {
                const { data } = await axios.get(`http://localhost:3000/products`, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                console.log("Products:", data);
                setProducts(data); // Lưu sản phẩm vào state
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <>
            <Container maxWidth='xl' style={{ display: 'flex', justifyContent: "center", padding: 0, flexDirection: "column", marginBottom: 70 }}>
                <Box padding={1}>
                    <Carousel />
                </Box>
                <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>Categories</Typography>
                <Container maxWidth='xl' style={{ marginTop: 90, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 20, }}>
                    {
                        BannerData.map(data => (
                            <CategoryCard data={data} key={data.img} />
                        ))
                    }
                </Container>
                <Typography variant='h4' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>Products</Typography>
                <Container maxWidth='xl' style={{ marginTop: 20, display: "flex", justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
                    {
                        products.map(product => (
                            <div key={product._id}>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography>Price: ${product.price}</Typography>
                            </div>
                        ))
                    }
                </Container>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};
export default HomePage