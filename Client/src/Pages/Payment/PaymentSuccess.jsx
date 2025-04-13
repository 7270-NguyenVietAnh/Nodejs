import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { AiOutlineFileDone } from 'react-icons/ai';

const PaymentSuccess = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h4" color="primary" gutterBottom>
                Payment Successful <AiOutlineFileDone style={{ color: '#1976d2' }} />
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Your order has been placed successfully. Thank you for shopping with us!
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Link to="/">
                    <Button variant="contained" color="primary">
                        Back to Home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default PaymentSuccess;