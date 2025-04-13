import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

const colors = [
    '#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FF7F50', '#87CEEB', '#DDA0DD', '#FFA07A'
];

const getRandomColor = (name) => {
    // Tạo "màu" theo tên để màu consistent giữa các lần render
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i);
    }
    return colors[hash % colors.length];
};

const CategoryCard = ({ data }) => {
    const slug = slugify(data.name, { lower: true, strict: true });
    const bgColor = getRandomColor(data.name);

    return (
        <Link to={`/product/type/${slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
                width: 180,
                height: 180,
                borderRadius: 20,
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                padding: 10,
                margin: 10
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
            >
                {data.name}
            </div>
        </Link>
    );
};

export default CategoryCard;
