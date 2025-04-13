import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const ImportExcel = ({ getProductInfo }) => {
    const [file, setFile] = useState(null);
    const authToken = localStorage.getItem("Authorization");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Please choose a file to import");
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', file); // Tên phải khớp với multer trên backend

        try {
            const { data } = await axios.post("http://localhost:3000/products", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (data.success) {
                toast.success("Products imported successfully");
                getProductInfo(); // Load lại danh sách sản phẩm
                setFile(null);
            } else {
                toast.error(data.message || "Failed to import products");
            }
        } catch (error) {
            console.error("Error importing products:", error);
            toast.error("Failed to import products");
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleImport}>
                Import Excel
            </Button>
        </Box>
    );
};

export default ImportExcel;