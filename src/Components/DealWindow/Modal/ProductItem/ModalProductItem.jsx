import styles from "./ProductItem.module.css";
import React from "react";

const ModalProductItem = ({ product, setQuantities, quantities, handleProductClick }) => {
    return (
        <div key={product.id} className={styles.productItem}>
            <div className={styles.productNameContainer}>
                <span className={styles.productName}>{product.name}</span>
            </div>
            <span className={styles.productInfoLine}>{`Цена: ${product.price_1} ₽`}</span>
            <span className={styles.productInfoLine}>{`Доступно: ${product.amount}`}</span>
            <div className={styles.quantityControls}>
                <div
                    className={styles.quantityButton}
                    onClick={() => setQuantities(prev => ({
                        ...prev,
                        [product.id]: Math.max(0, (prev[product.id] || 1) - 1), // Decrease quantity for the specific product
                    }))}
                    role="button" // Accessibility role
                    tabIndex={0} // Make div focusable
                    onKeyPress={(e) => { // Add keypress event for accessibility
                        if (e.key === 'Enter' || e.key === ' ') {
                            setQuantities(prev => ({
                                ...prev,
                                [product.id]: Math.max(0, (prev[product.id] || 1) - 1),
                            }));
                        }
                    }}
                >
                    -
                </div>
                <span className={styles.quantityDisplay}>{quantities[product.id] || 0}</span>
                <div
                    className={styles.quantityButton}
                    onClick={() => setQuantities(prev => ({
                        ...prev,
                        [product.id]: Math.min(product.amount, (prev[product.id] || 1) + 1), // Increase quantity for the specific product
                    }))}
                    role="button" // Accessibility role
                    tabIndex={0} // Make div focusable
                    onKeyPress={(e) => { // Add keypress event for accessibility
                        if (e.key === 'Enter' || e.key === ' ') {
                            setQuantities(prev => ({
                                ...prev,
                                [product.id]: Math.min(product.amount, (prev[product.id] || 1) + 1),
                            }));
                        }
                    }}
                >
                    +
                </div>
            </div>

            <div
                className={styles.detailsButton}
                onClick={() => handleProductClick(product)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleProductClick(product);
                    }
                }}
            >
                ...
            </div>
        </div>
    );
}

export default ModalProductItem;
