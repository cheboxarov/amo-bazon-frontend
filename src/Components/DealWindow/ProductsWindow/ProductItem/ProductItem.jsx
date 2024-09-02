import styles from "./ProductItem.module.css";
import React from "react";

const ProductItem = ({ product, handleToggle, expandedProductId }) => {

    const handleDelete = (id) => {
        // Логика удаления товара
        console.log(`Удаляем товар с ID: ${id}`);
    };

    return (
        <li key={product.id} className={styles.productItem} onClick={() => handleToggle(product.id)}>
            <span className={styles.productName}>{product.name}</span>
            <div className={`${styles.expandedInfo} ${expandedProductId === product.id ? styles.expanded : ''}`}>
                <span className={styles.productInfoLine}>Цена: {product.cost}₽</span><br/>
                <span className={styles.productInfoLine}>Количество: {product.amount}</span><br/>
                <span className={styles.productInfoLine}>Статус: {product.state_}</span><br/>

                {/* Кнопка удаления */}
                <button className={styles.deleteButton} onClick={(e) => {
                    e.stopPropagation(); // Остановить событие клика от всплытия
                    handleDelete(product.id);
                }}>
                    &times; {/* HTML символ для крестика */}
                </button>
            </div>
        </li>
    );
}

export default ProductItem;
