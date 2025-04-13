import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import styles from './Update.module.css'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { TiArrowBackOutline } from 'react-icons/ti';

import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'


const UpdateDetails = () => {
    const [userData, setUserData] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    let authToken = localStorage.getItem('Authorization');
    let setProceed = authToken ? true : false;
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        avatarUrl: '',
    });
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    let navigate = useNavigate();

    // Định nghĩa regex kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        setProceed ? getUserData() : navigate('/');
    }, []);

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3000/users/details`, {
                headers: {
                    Authorization: authToken,
                },
            });

            console.log('User Data:', data); // Debug dữ liệu trả về từ API

            setUserDetails({
                fullName: data.fullName || '',
                email: data.email || '',
                avatarUrl: data.avatarUrl || '',
            });
            setUserData(data); // Gán dữ liệu vào userData
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Something went wrong', { autoClose: 500, theme: 'colored' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('User Data ID:', userData._id); // Debug userData._id

        try {
            if (!userDetails.email || !userDetails.fullName) {
                toast.error('Please fill all required fields', { autoClose: 500, theme: 'colored' });
            } else if (!emailRegex.test(userDetails.email)) {
                toast.error('Please enter a valid email', { autoClose: 500, theme: 'colored' });
            } else {
                const payload = {
                    fullName: userDetails.fullName,
                    email: userDetails.email,
                    avatarUrl: userDetails.avatarUrl,
                };

                // Nếu người dùng muốn đặt lại mật khẩu
                if (password.currentPassword && password.newPassword) {
                    payload.currentPassword = password.currentPassword;
                    payload.newPassword = password.newPassword;
                }

                const { data } = await axios.put(`http://localhost:3000/users/update/${userData._id}`, payload, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                if (data.success) {
                    toast.success('Profile updated successfully', { autoClose: 500, theme: 'colored' });
                    getUserData(); // Lấy lại thông tin người dùng sau khi cập nhật
                    setPassword({ currentPassword: '', newPassword: '' }); // Reset mật khẩu trong form
                } else {
                    toast.error('Something went wrong', { autoClose: 500, theme: 'colored' });
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile', { autoClose: 500, theme: 'colored' });
        }
    };
    const deleteAccount = async () => {
        try {
            const deleteUser = await axios.delete(`${process.env.REACT_APP_DELETE_USER_DETAILS}/${userData._id}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            toast.success("Account deleted successfully", { autoClose: 500, theme: 'colored' })
            localStorage.removeItem('Authorization');
            sessionStorage.removeItem('totalAmount');
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data, { autoClose: 500, theme: 'colored' })

        }
    }
    return (
        <>
            <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 10 }}>
                <Typography variant='h6' sx={{ margin: '30px 0', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
                <form noValidate autoComplete="off" className={styles.checkout_form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Full Name"
                                name="fullName"
                                value={userDetails.fullName || ''}
                                onChange={handleOnchange}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                name="email"
                                value={userDetails.email || ''}
                                onChange={handleOnchange}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Avatar"
                                name="avatarUrl"
                                value={userDetails.avatarUrl || ''}
                                onChange={handleOnchange}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                        <Button variant="contained" endIcon={<TiArrowBackOutline />} onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button variant="contained" endIcon={<AiOutlineFileDone />} type="submit">
                            Save
                        </Button>
                    </Container>
                </form>

                <Typography variant='h6' sx={{ margin: '20px 0', fontWeight: 'bold', color: '#1976d2' }}>Reset Password</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Current Password"
                                name="currentPassword"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    ),
                                }}
                                value={password.currentPassword || ''}
                                onChange={(e) => setPassword({ ...password, [e.target.name]: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="New Password"
                                name="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ cursor: 'pointer' }}>
                                            {showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    ),
                                }}
                                value={password.newPassword || ''}
                                onChange={(e) => setPassword({ ...password, [e.target.name]: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '25px 0', width: '100%' }}>
                        <Button variant="contained" color="primary" endIcon={<RiLockPasswordLine />} type="submit">
                            Reset
                        </Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                    <Typography variant='h6'>Delete Your Account?</Typography>
                    <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                </Box>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            <Typography variant='body1'>Your all data will be erased</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteAccount}>Delete</Button>
                        <Button variant='contained' color='primary'
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container >
            <CopyRight sx={{ mt: 4, mb: 10 }} />
        </>
    )
}

export default UpdateDetails
