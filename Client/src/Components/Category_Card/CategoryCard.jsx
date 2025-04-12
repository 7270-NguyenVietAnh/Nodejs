import React from 'react';
import styles from './Category.module.css';
import { Link } from 'react-router-dom';
import slugify from 'slugify'; // Sử dụng slugify để chuẩn hóa URL

const CategoryCard = ({ data }) => {
    const slug = slugify(data.name, { lower: true, strict: true }); // Chuyển tên danh mục thành slug
    return (
        <Link to={`/product/type/${slug}`}>
            <div className={styles.mainCard}>
                <img src={data.img} alt="" className={styles.mainImg} loading="lazy" />
                <span className={styles.imgTitle}>{data.name}</span>
            </div>
        </Link>
    );
};

export default CategoryCard;