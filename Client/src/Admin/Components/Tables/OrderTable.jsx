import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Typography,
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';

const OrderTable = () => {
    const [usersWithOrders, setUsersWithOrders] = useState([]);
    const [openUserId, setOpenUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch users and their orders from API
    useEffect(() => {
        const fetchUsersWithOrders = async () => {
            try {
                const authToken = localStorage.getItem("Authorization");
                const response = await axios.get('http://localhost:3000/checkout/ordered-users', {
                    headers: {
                        'Authorization': authToken,
                    },
                });

                if (response.data.success) {
                    setUsersWithOrders(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch users with orders");
                }
            } catch (err) {
                console.error("Error fetching users with orders:", err);
                setError("Failed to fetch users with orders");
            } finally {
                setLoading(false);
            }
        };

        fetchUsersWithOrders();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (usersWithOrders.length === 0) {
        return <Typography>No users have placed orders yet.</Typography>;
    }

    return (
        <Paper style={{ overflow: "auto", maxHeight: "500px" }}>
            <TableContainer sx={{ maxHeight: '500px' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>User Name</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Zip Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersWithOrders.map((user) => (
                            <React.Fragment key={user.userDetails._id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpenUserId(openUserId === user.userDetails._id ? "" : user.userDetails._id)}
                                        >
                                            {<MdKeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{user.userDetails.username}</TableCell>
                                    <TableCell>{user.userDetails.email}</TableCell>
                                    <TableCell>{user.userDetails.city}</TableCell>
                                    <TableCell>{user.userDetails.zipCode}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={openUserId === user.userDetails._id} timeout="auto" unmountOnExit>
                                            <div style={{ margin: "20px" }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Orders:
                                                </Typography>
                                                {user.orders.map((order) => (
                                                    <div key={order.orderId} style={{ marginBottom: "15px" }}>
                                                        <Typography>{`Order ID: ${order.orderId}`}</Typography>
                                                        <Typography>{`Total Amount: ₹${order.amount}`}</Typography>
                                                        <Typography>{`Date: ${new Date(order.createdAt).toLocaleDateString()}`}</Typography>
                                                        <Typography>Products:</Typography>
                                                        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                            {order.products.map((product) => (
                                                                <li key={product.productId} style={{ listStyle: 'none', textAlign: 'center' }}>
                                                                    <Link to={`/Detail/type/${product.category}/${product.productId}`}>
                                                                        <img
                                                                            src={`http://localhost:3000${product.imgURL}`}
                                                                            alt={product.name}
                                                                            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                                                        />
                                                                        <Typography>{product.name}</Typography>
                                                                    </Link>
                                                                    <Typography>{`Quantity: ${product.quantity}`}</Typography>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrderTable;