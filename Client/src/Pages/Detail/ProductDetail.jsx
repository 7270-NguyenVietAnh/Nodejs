import './Productsimilar.css'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Chip,
    Rating,
    ButtonGroup,
    Skeleton,
} from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md'
import { AiFillHeart, AiFillCloseCircle, AiOutlineLogin, AiOutlineShareAlt } from 'react-icons/ai'
import { TbDiscount2 } from 'react-icons/tb'
import axios from 'axios';
import { toast } from 'react-toastify';
import { ContextFunction } from '../../Context/Context';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { Transition, getSingleProduct } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';



const ProductDetail = () => {
    const { cart, setCart, wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);
    const { id, cat } = useParams()
    const [product, setProduct] = useState([])
    const [similarProduct, setSimilarProduct] = useState([])
    const [productQuantity, setProductQuantity] = useState(1)
    const [loading, setLoading] = useState(true);


    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/products/${id}`);
                setProduct(data.data); // Lấy thông tin sản phẩm từ API
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        const fetchSimilarProducts = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/products?category=${cat}`);
                setSimilarProduct(data.filter((prod) => prod._id !== id)); // Lọc sản phẩm cùng loại, loại bỏ sản phẩm hiện tại
            } catch (error) {
                console.error('Error fetching similar products:', error);
            }
        };

        fetchProduct();
        fetchSimilarProducts();
        window.scroll(0, 0); // Cuộn lên đầu trang
    }, [id, cat]);
    const addToCart = async (product) => {
        if (setProceed) {
            try {


                const { data } = await axios.post(`${process.env.REACT_APP_ADD_CART}`, { _id: product._id, quantity: productQuantity }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setCart(data)
                setCart([...cart, product])
                toast.success("Added To Cart", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                toast.error(error.response.data.msg, { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }
    }
    const addToWhishList = async (product) => {
        if (setProceed) {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_ADD_WISHLIST}`, { _id: product._id }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setWishlistData(data)
                setWishlistData([...wishlistData, product])
                toast.success("Added To Wishlist", { autoClose: 500, theme: 'colored' })
            }
            catch (error) {
                toast.error(error.response.data.msg, { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }

    };
    const shareProduct = (product) => {

        const data = {
            text: product.name,
            title: "e-shopit",
            url: `https://e-shopit.vercel.app/Detail/type/${cat}/${id}`
        }
        if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data);
        }
        else {
            toast.error("browser not support", { autoClose: 500, theme: 'colored' })
        }

    }
    const getSimilarProducts = async () => {
        const { data } = await axios.post(`${process.env.REACT_APP_PRODUCT_TYPE}`, { userType: cat })
        setSimilarProduct(data)
    }
    let data = [];
    if (cat === 'shoe') {
        data.push(product?.brand, product?.gender, product?.category)
    }
    else if (cat === 'book') {
        data.push(product.author, product.category)
    }
    else if (cat === 'cloths') {
        data.push(product.category, cat)
    }
    else if (cat === 'electronics') {
        data.push(product.category, cat)
    }
    else if (cat === 'jewelry') {
        data.push(cat)
    }
    const increaseQuantity = () => {
        setProductQuantity((prev) => prev + 1)
        if (productQuantity >= 5) {
            setProductQuantity(5)
        }
    }
    const decreaseQuantity = () => {
        setProductQuantity((prev) => prev - 1)
        if (productQuantity <= 1) {
            setProductQuantity(1)
        }
    }
    if (loading) {
        return (
            <Container maxWidth="md">
                <Skeleton variant="rectangular" height={400} />
                <Skeleton variant="text" height={50} />
                <Skeleton variant="text" height={50} />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="md">
                <Typography variant="h5" color="error">
                    Product not found
                </Typography>
            </Container>
        );
    }
    return (
        <>
            <Container maxWidth='xl' >
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            Please Login To Proceed
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Link to="/login"> <Button variant='contained' endIcon={<AiOutlineLogin />} color='primary'>Login</Button></Link>
                        <Button variant='contained' color='error'
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>

                <main className='main-content'>
                    {loading ? (
                        <Skeleton variant='rectangular' height={400} />
                    ) : (
                        <div className="product-image">
                            <div className='detail-img-box'  >
                                    <img
                                        src={`http://localhost:3000${encodeURI(product.imgURL)}`}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                <br />
                            </div>
                        </div>
                    )}
                    {loading ? (
                        <section style={{ display: 'flex', flexWrap: "wrap", width: "100%", justifyContent: "space-around", alignItems: 'center' }}>
                            <Skeleton variant='rectangular' height={200} width="200px" />
                            <Skeleton variant='text' height={400} width={700} />

                        </section>

                    ) : (
                        <section className='product-details'>
                            <Typography variant='h4'>{product.name}</Typography>

                            <Typography >
                                {product.description}
                            </Typography>
                            <Typography >
                                <div className="chip">
                                    {
                                        data.map((item, index) => (
                                            <Chip label={item} key={index} variant="outlined" />
                                        ))
                                    }
                                </div>
                            </Typography>
                            
                            <div style={{ display: 'flex', gap: 20 }}>
                                <Typography variant="h6" color="primary">
                                    ₹{product.price}
                                </Typography>
                            </div>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // background: 'red',
                                    '& > *': {
                                        m: 1,
                                    },
                                }}
                            >
                                <ButtonGroup variant="outlined" aria-label="outlined button group">
                                    <Button onClick={increaseQuantity}>+</Button>
                                    <Button>{productQuantity}</Button>
                                    <Button onClick={decreaseQuantity}>-</Button>
                                </ButtonGroup>
                            </Box>
                            <Rating name="read-only" value={Math.round(product.rating)} readOnly precision={0.5} />
                            <div style={{ display: 'flex' }} >
                                <Tooltip title='Add To Cart'>
                                    <Button variant='contained' className='all-btn' startIcon={<MdAddShoppingCart />} onClick={(() => addToCart(product))}>Buy</Button>
                                </Tooltip>
                                <Tooltip title='Add To Wishlist'>
                                    <Button style={{ marginLeft: 10, }} size='small' variant='contained' className='all-btn' onClick={(() => addToWhishList(product))}>
                                        {<AiFillHeart fontSize={21}/>}
                                    </Button>

                                </Tooltip>
                                <Tooltip title='Share'>
                                    <Button style={{ marginLeft: 10 }} variant='contained' className='all-btn' startIcon={<AiOutlineShareAlt />} onClick={() => shareProduct(product)}>Share</Button>
                                </Tooltip>

                            </div>
                        </section>
                    )}
                </main>


                <Typography sx={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold', textAlign: 'center' }}>
                    Similar Products
                </Typography>
                <Box sx={{ display: 'flex', overflowX: 'auto', marginBottom: 10 }}>
                    {similarProduct.map((prod) => (
                        <Link to={`/Detail/type/${cat}/${prod._id}`} key={prod._id}>
                            <ProductCard prod={prod} />
                        </Link>
                    ))}
                </Box>

            </Container >
            <CopyRight   sx={{ mt: 8, mb: 10 }} />

        </>
    )
}

export default ProductDetail