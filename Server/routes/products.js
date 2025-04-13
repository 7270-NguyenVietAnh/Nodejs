var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product')
let categorySchema = require('../schemas/category')
let slugify = require('slugify')
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

// Cấu hình nơi lưu ảnh và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // tạo thư mục 'uploads' trong thư mục gốc
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // tên file là timestamp + đuôi file
    }
});

const upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let query = req.query;
    let objQuery = {};

    if (query.category) {
        const category = await categorySchema.findOne({ slug: query.category });
        if (category) {
            objQuery.category = category._id;
        } else {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
    }

    if (query.name) {
        objQuery.name = new RegExp(query.name, 'i');
    }

    objQuery.price = {};
    if (query.price) {
        if (query.price.$gte) {
            objQuery.price.$gte = Number(query.price.$gte);
        } else {
            objQuery.price.$gte = 0;
        }
        if (query.price.$lte) {
            objQuery.price.$lte = Number(query.price.$lte);
        } else {
            objQuery.price.$lte = 10000;
        }
    } else {
        objQuery.price.$lte = 999999999;
        objQuery.price.$gte = 0;
    }

    let products = await productSchema.find(objQuery).populate({
        path: 'category',
        select: 'name',
    });
    res.send(products);
});

router.get('/:id', async function (req, res, next) {
    try {
        let product = await productSchema.findById(req.params.id);
        res.send({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});

router.post('/', upload.single('excelFile'), async function (req, res, next) {
    try {
        if (req.file) {
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[sheetName];

            
            let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            rows.shift(); 

            const savedProducts = [];

            for (const row of rows) {
                const [name, price, quantity, category, description, imgURL] = row;
            
                const categoryDoc = await categorySchema.findOne({ name: category });
                if (!categoryDoc) {
                    return res.status(404).send({ success: false, message: `Category ${category} not found` });
                }
            
                const existingProduct = await productSchema.findOne({ name });
            
                if (existingProduct) {
                    
                    existingProduct.quantity += quantity || 0;
                    await existingProduct.save();
                    savedProducts.push(existingProduct);
                    continue;
                }
         
                const newProduct = new productSchema({
                    name,
                    price: price || 999999999,
                    quantity: quantity || 10,
                    category: categoryDoc._id,
                    description: description || '',
                    imgURL: imgURL || '',
                    slug: slugify(name, { lower: true }),
                });
            
                const savedProduct = await newProduct.save();
                savedProducts.push(savedProduct);
            }

            // Xoá file sau khi xử lý
            fs.unlinkSync(req.file.path);

            return res.status(200).send({
                success: true,
                message: 'Products imported successfully',
                data: savedProducts,
            });
        }

        // Trường hợp thêm thủ công (form)
        const body = req.body;
        const category = await categorySchema.findOne({ name: body.category });
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        const newProduct = new productSchema({
            name: body.name,
            price: body.price || 999999999,
            quantity: body.quantity || 10,
            category: category._id,
            description: body.description || '',
            imgURL: body.imgURL || '',
            slug: slugify(body.name, { lower: true }),
        });

        await newProduct.save();
        res.status(200).send({
            success: true,
            data: newProduct,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});


router.put('/:id', upload.single('image'), async function (req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {};

        // Cập nhật các trường thông tin sản phẩm
        if (body.name) {
            updatedObj.name = body.name;
        }
        if (body.quantity) {
            updatedObj.quantity = body.quantity;
        }
        if (body.price) {
            updatedObj.price = body.price;
        }
        if (body.category) {
            updatedObj.category = body.category;
        }
        if (body.description) {
            updatedObj.description = body.description;
        }

        // Nếu có file ảnh được upload, cập nhật imgURL
        if (req.file) {
            updatedObj.imgURL = `/uploads/${req.file.filename}`;
        }

        // Cập nhật sản phẩm trong cơ sở dữ liệu
        let updatedProduct = await productSchema.findByIdAndUpdate(req.params.id, updatedObj, { new: true });
        res.status(200).send({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message,
        });
    }
});
router.delete('/:id', async function (req, res, next) {
    try {
        let body = req.body;
        let updatedProduct = await productSchema.findByIdAndUpdate(req.params.id, {
            isDeleted: true
        }, { new: true })
        res.status(200).send({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});




module.exports = router;