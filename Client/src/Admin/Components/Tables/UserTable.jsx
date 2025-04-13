import React, { useState } from 'react';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserTable = ({ user, getUser }) => {
    const columns = [
        { id: 'username', label: 'Username', minWidth: 150, align: 'center' },
        { id: 'email', label: 'Email', minWidth: 200, align: 'center' },
        { id: 'date', label: 'Created On', minWidth: 150, align: 'center' },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = user.filter((u) => {
        const username = u.username?.toLowerCase() || '';
        const phoneNumber = u.phoneNumber?.toString() || '';
        const email = u.email?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return (
            username.includes(query) ||
            phoneNumber.includes(query) ||
            email.includes(query)
        );
    });

    const toggleUserStatus = async (id, isDelete) => {
        try {
            const { data } = await axios.put(`http://localhost:3000/users/toggle-status/${id}`, { isDelete });
            if (data.success) {
                toast.success(data.message);
                getUser(); // Refresh danh sách người dùng
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error('Failed to update user status');
        }
    };

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search Users"
                    onChange={handleSearchInputChange}
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
            <Paper style={{ overflow: 'auto' }}>
                <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            minWidth: column.minWidth,
                                            color: '#1976d2',
                                            fontWeight: 'bold',
                                            textAlign: column.align,
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <h4>User not found.</h4>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((info) => (
                                    <TableRow key={info._id}>
                                        <TableCell align="center">
                                            <Link to={`user/${info._id}`}>{info.username}</Link>
                                        </TableCell>
                                        <TableCell align="center">{info.email}</TableCell>
                                        <TableCell align="center">
                                            {new Date(info.createdAt).toLocaleDateString('en-us', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
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

export default UserTable;