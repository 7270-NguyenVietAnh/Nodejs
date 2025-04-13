import React, { useEffect, useState } from 'react';
import { AiOutlineSearch, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    InputAdornment,
    IconButton,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import axios from 'axios';
import AddProduct from '../AddProduct';
import ImportExcel from '../ImportExcel'; // Import component ImportExcel

const ProductTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'edit', label: 'Edit', minWidth: 100, align: 'center' },
        { id: 'delete', label: 'Delete', minWidth: 100, align: 'center' },
    ];

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/products');
            setData(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const filterData = () => {
        if (searchTerm === '') return data;

        return data.filter(
            (item) =>
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.price && item.price.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const newFilteredData = filterData();
        setFilteredData(newFilteredData);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredData(filterData());
    }, [data, searchTerm]);

    return (
        <>
            <Container sx={{ marginBottom: 5, marginTop: 5 }}>
            <Box sx={{ marginBottom: 3 }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search Products"
                    value={searchTerm}
                    onChange={handleSearch}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AiOutlineSearch />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mr: 3 }}>Thêm sản phẩm mới</Typography>
                        <AddProduct getProductInfo={fetchProducts} />
                    </Box>
                    <ImportExcel getProductInfo={fetchProducts} />
                </Box>
            </Box>
        </Container>

        {/* Bảng sản phẩm */}
        <Paper style={{ overflow: 'auto', maxHeight: '500px' }}>
            <TableContainer sx={{ maxHeight: '500px' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead sx={{ position: 'sticky', top: 0 }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, color: '#1976d2', fontWeight: 'bold' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <h4>Product not found.</h4>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((prod) => (
                                <TableRow key={prod._id}>
                                    <TableCell align="center">
                                        <Link to={`/admin/home/product/${prod._id}`}>
                                            {prod.name.slice(0, 20)}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link to={`/admin/home/product/${prod._id}`}>
                                            <img
                                                src={
                                                    prod.imgURL
                                                        ? `http://localhost:3000${encodeURI(prod.imgURL)}`
                                                        : 'http://localhost:3000/uploads/default.jpg' // Ảnh mặc định nếu không có imgURL
                                                }
                                                alt={prod.name}
                                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                            />
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link to={`/admin/home/product/${prod._id}`}>
                                            ₹{prod.price}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/admin/home/product/edit/${prod._id}`)}
                                        >
                                            <AiOutlineEdit size={20} />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(prod._id)}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        </>
    );
};

export default ProductTable;