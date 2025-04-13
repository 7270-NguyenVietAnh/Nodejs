import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import BannerData from '../../Helpers/HomePageBanner';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import slugify from 'slugify'; // Import slugify

const Carousel = () => {
    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3, itemsFit: 'contain' },
    };

    const items = BannerData.map((item) => {
        const slug = slugify(item.name, { lower: true, strict: true }); // Chuyển tên thành slug
        return (
            <Link to={`product/type/${slug}`} key={item.name}>
                <div className="item" style={{ marginTop: 10 }}>
                    <img
                        src={item.img}
                        loading="lazy"
                        alt={item.name}
                        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                    />
                </div>
            </Link>
        );
    });

    return (
        <AliceCarousel
            animationType="fadeout"
            animationDuration={800}
            disableButtonsControls
            infinite
            items={items}
            touchTracking
            mouseTracking
            disableDotsControls
            autoPlay
            autoPlayInterval={2500}
            responsive={responsive}
        />
    );
};

export default Carousel;