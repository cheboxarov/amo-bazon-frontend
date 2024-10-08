import styles from "./ProductItem.module.css";
import React, { useState } from "react";
import { BASE_URL } from "../../../../settings";

const ProductItem = ({ store, products, setProducts, product, handleToggle, expandedProductId }) => {
    const [isDeleting, setDeleting] = useState(false);
    const deal = store.state.currentDeal.dealDetails
    const isIssued = deal.state === "issued"
    const handleDelete = async (id) => {
        setDeleting(true);  // Начинаем процесс удаления, включаем спиннер
        const dealId = window.AMOCRM.data.current_card.id;
        const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/delete-item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "dealId": dealId,
                "itemId": id
            })
        });

        if (response.ok) {
            setProducts(products.filter(p => p.id !== id));
        }

        setDeleting(false);  // Завершаем процесс удаления, выключаем спиннер
    };

    let returnedInfo = ""
    console.log(product)
    if (product.returnedAmount > 0) {
        returnedInfo += `(Возвращено в кол-ве ${product.returnedAmount} шт.)`
    }

    return (
        <li key={product.id} className={styles.productItem} onClick={() => handleToggle(product.id)}>
            <span className={styles.productName}>{product.name} {returnedInfo}</span>
            <div className={`${styles.expandedInfo} ${expandedProductId === product.id ? styles.expanded : ''}`}>
                <span className={styles.productInfoLine}>Цена: {product.cost}₽</span><br />
                <span className={styles.productInfoLine}>Количество: {product.amount}</span><br />
                <span className={styles.productInfoLine}>Статус: {product.state_}</span><br />

                {/* Кнопка удаления или спиннер */}
                <div className={styles.deleteButton} onClick={(e) => {
                    e.stopPropagation(); // Остановить событие клика от всплытия
                    if (!isDeleting) handleDelete(product.id);
                }}>
                    { deal.state !== "issued" && (isDeleting ? (
                        <div className={styles.spinner}></div> // Отображаем спиннер во время удаления
                    ) : (
                        <span>&times;</span> // Отображаем символ крестика
                    ))}
                </div>
            </div>
        </li>
    );
}

export default ProductItem;
