import React, { useState } from 'react';
import styles from './Products.module.css';
import ProductItem from "./ProductItem/ProductItem"; // Импортируем стили

const ProductsWidget = ({ products, openModal }) => {
    const [expandedProductId, setExpandedProductId] = useState(null);

    const handleToggle = (id) => {
        setExpandedProductId(expandedProductId === id ? null : id);
    };
    return (
        <div className={styles.productsContainer}>
            <div onClick={openModal} className={styles.addProductButton}>
                Добавить товар
            </div>
            {products.length === 0 ? (
                <p>Товары отсутствуют.</p>
            ) : (
                <ul className={styles.productList}>
                    {products.map(product => (
                        <ProductItem product={product} expandedProductId={expandedProductId}
                                     handleToggle={handleToggle.bind(this)}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductsWidget;
