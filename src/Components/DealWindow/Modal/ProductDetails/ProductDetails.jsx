import React, { useState } from 'react';
import styles from './ProductDetails.module.css'; // Подключение CSS

const ProductDetails = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product._columns.char_picturesThumb.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product._columns.char_picturesThumb.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className={styles.detailsModal}>
            <div className={styles.detailsContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>{product.name}</h2>

                <div className={styles.imageContainer}>
                    <div onClick={handlePrevImage} className={styles.navButton}>{"<"}</div>
                    <img
                        src={product._columns.char_picturesThumb[currentImageIndex]}
                        alt={product.name}
                        className={styles.productImage}
                    />
                    <div onClick={handleNextImage} className={styles.navButton}>{">"}</div>
                </div>

                <p>Цена: {product.price_1} ₽</p>
                <p>Производитель: {product._columns.char_manufacturer}</p>
                <p>Модель: {product._columns.char_carsrc_mark} {product._columns.char_carsrc_model}</p>
                <p>Год: {product._columns.char_carsrc_year}</p>
                <p>Количество: {product.amount}</p>
            </div>
        </div>
    );
};

export default ProductDetails;
