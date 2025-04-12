import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, InputLabel, MenuItem, FormControl, Select,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdProductionQuantityLimits } from 'react-icons/md';

const AddProduct = ({ getProductInfo }) => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productInfo, setProductInfo] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        category: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/categories");
                setCategories(data);
            } catch (error) {
                toast.error("Không thể tải danh mục sản phẩm", { autoClose: 500, theme: 'colored' });
            }
        };
        fetchCategories();
    }, []);

    const handleOnChange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const { name, price, quantity, category, description } = productInfo;

            if (!name || !price || !quantity || !category) {
                toast.error("Vui lòng điền đầy đủ thông tin", { autoClose: 500, theme: 'colored' });
                setIsUploading(false);
                return;
            }

            let imgURL = "";
            if (imageFile) {
                const formData = new FormData();
                formData.append("imgFile", imageFile); // phải khớp với multer trong BE

                const uploadRes = await axios.post("http://localhost:3000/uploads/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${authToken}`
                    }
                });

                imgURL = uploadRes.data?.imageUrl || "";
            }

            const { data } = await axios.post("http://localhost:3000/products", {
                name,
                price: Number(price),
                quantity: Number(quantity),
                category,
                description: description || "",
                imgURL: imgURL
            }, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (data.success) {
                toast.success("Thêm sản phẩm thành công", { autoClose: 500, theme: 'colored' });
                getProductInfo();
                setProductInfo({
                    name: "",
                    price: "",
                    quantity: "",
                    category: "",
                    description: "",
                });
                setImageFile(null);
                setOpen(false);
            } else {
                toast.error(data.message || "Đã xảy ra lỗi", { autoClose: 500, theme: 'colored' });
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Đã xảy ra lỗi", { autoClose: 500, theme: 'colored' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "20px 0" }}>
                <Typography variant='h6' color="#1976d2" fontWeight="bold">Thêm Sản Phẩm Mới</Typography>
                <Button variant='contained' endIcon={<MdProductionQuantityLimits />} onClick={() => setOpen(true)}>Thêm</Button>
            </Box>
            <Divider sx={{ mb: 5 }} />
            <Dialog open={open} onClose={() => setOpen(false)} keepMounted TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}>Thêm Sản Phẩm Mới</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField label="Tên sản phẩm" name='name' value={productInfo.name} onChange={handleOnChange} fullWidth required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Danh mục sản phẩm</InputLabel>
                                        <Select
                                            value={productInfo.category}
                                            name='category'
                                            onChange={handleOnChange}
                                            label="Danh mục sản phẩm"
                                        >
                                            {categories.map(cat => (
                                                <MenuItem value={cat.name} key={cat._id || cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Giá" name='price' value={productInfo.price} onChange={handleOnChange} type="number" fullWidth required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Số lượng" name='quantity' value={productInfo.quantity} onChange={handleOnChange} type="number" fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Mô tả sản phẩm"
                                        name='description'
                                        value={productInfo.description}
                                        onChange={handleOnChange}
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh sản phẩm (không bắt buộc)</InputLabel>
                                    <TextField
                                        type="file"
                                        onChange={handleImageChange}
                                        fullWidth
                                        inputProps={{ accept: "image/*" }}
                                    />
                                    {imageFile && (
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            Đã chọn: {imageFile.name}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ justifyContent: 'space-between', mt: 2 }}>
                                <Button variant='contained' color='error' onClick={() => setOpen(false)} endIcon={<MdOutlineCancel />}>Hủy</Button>
                                <Button type="submit" variant="contained" endIcon={<MdProductionQuantityLimits />} disabled={isUploading}>
                                    {isUploading ? "Đang xử lý..." : "Thêm"}
                                </Button>
                            </DialogActions>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddProduct;
