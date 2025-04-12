import React, { useEffect, useState } from 'react';
import { AiOutlineSearch, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
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
    TextField,
    Button,
    IconButton,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductTable = () => {
    const [data, setData] = useState([]); // State lưu danh sách sản phẩm
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const columns = [
        { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
    ];

    // Hàm gọi API lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/products'); // Gọi API
            setData(data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filterData = () => {
        if (searchTerm === '') {
            return data;
        }
        return data.filter(
            (item) =>
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.price && item.price.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const newFilteredData = filterData();
        setFilteredData(newFilteredData);
    };

    // Gọi API khi component được render
    useEffect(() => {
        fetchProducts();
    }, []);

    // Cập nhật dữ liệu lọc khi `data` hoặc `searchTerm` thay đổi
    useEffect(() => {
        setFilteredData(filterData());
    }, [data, searchTerm]);

    return (
        <>
            <Container sx={{ marginBottom: 5, marginTop: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        id="search"
                        type="search"
                        label="Search Products"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ width: { xs: 350, sm: 500, md: 800 } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AiOutlineSearch />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AiOutlinePlus />}
                        onClick={() => navigate('/admin/home/product/add')}
                    >
                        Add Product
                    </Button>
                </Box>
            </Container>
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
                                            <img
                                                src={`http://localhost:3000${encodeURI(prod.imgURL)}`}
                                                alt={prod.name}
                                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{prod.name}</TableCell>
                                        <TableCell align="center">₹{prod.price}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/home/product/edit/${prod._id}`)}
                                            >
                                                <AiOutlineEdit size={20} />
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