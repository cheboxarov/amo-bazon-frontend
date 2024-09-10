import React, { useState } from 'react';
import styles from './Products.module.css';
import ProductItem from "./ProductItem/ProductItem"; // Импортируем стили

const ProductsWidget = ({ store }) => {
    const [expandedProductId, setExpandedProductId] = useState(null);

    const handleToggle = (id) => {
        setExpandedProductId(expandedProductId === id ? null : id);
    };

    const products = store.state.currentDeal.dealProducts
    const setProducts = store.setDealProducts.bind(store);

    return (
        <div className={styles.productsContainer}>
            <div onClick={store.openProductsWindow.bind(store)} className={styles.addProductButton}>
                Добавить товар
            </div>
            {products.length === 0 ? (
                <p>Товары отсутствуют.</p>
            ) : (
                <ul className={styles.productList}>
                    {products.map(product => (
                        <ProductItem product={product} expandedProductId={expandedProductId}
                                     handleToggle={handleToggle.bind(this)} setProducts={setProducts} products={products}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductsWidget;
