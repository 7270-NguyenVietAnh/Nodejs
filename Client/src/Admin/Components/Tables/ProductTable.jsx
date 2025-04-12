import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios để gọi API
import AddProduct from '../AddProduct';

const ProductTable = () => {
    const [data, setData] = useState([]); // State lưu danh sách sản phẩm
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
        { id: 'type', label: 'Product Type', align: 'center', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'rating', label: 'Rating', minWidth: 100, align: 'center' },
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
                (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.price && item.price.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.rating && item.rating.toString().toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
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
            </Container>
            <AddProduct getProductInfo={fetchProducts} /> {/* Truyền hàm fetchProducts để cập nhật danh sách */}
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
                                        <TableCell component="th" scope="row" align="center">
                                            <Link to={`/admin/home/product/${prod.type}/${prod._id}`}>
                                                {prod.name.slice(0, 20)}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/admin/home/product/${prod.type}/${prod._id}`}>
                                                <img
                                                     src={`http://localhost:3000${encodeURI(prod.imgURL)}`} // 
                                                    alt={prod.name}
                                                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/admin/home/product/${prod.type}/${prod._id}`}>
                                                {prod.type}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/admin/home/product/${prod.type}/${prod._id}`}>
                                                ₹{prod.price}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/admin/home/product/${prod.type}/${prod._id}`}>
                                                {prod.rating}
                                            </Link>
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