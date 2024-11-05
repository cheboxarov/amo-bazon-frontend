import styles from "./ProductItem.module.css";
import React, { useState } from "react";
import { BASE_URL } from "../../../../settings";

const ProductItem = ({ store, products, setProducts, product, handleToggle, expandedProductId }) => {
    const [isDeleting, setDeleting] = useState(false);
    const [isDiscountContOpen, setDiscountContOpen] = useState(false);
    const [discount, setDiscount] = useState("")
    const [discountType, setDiscountType] = useState("percent")

    const deal = store.state.currentDeal.dealDetails
    const isIssued = deal.state === "issued"

    const handleDelete = async (id) => {
        setDeleting(true);
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
        } else {
            store.setError("Невозможно удалить деталь.")
        }

        setDeleting(false);
    };

    const discountContClose = (e) => {
        e.stopPropagation(); 
        setDiscountContOpen(false);
        setDiscountType("percent");
        setDiscount("");
    }

    const discountContOpen = (e) => {
        e.stopPropagation(); 
        setDiscountContOpen(true);
        setDiscountType("percent");
        setDiscount("");
    }

    const handleSaveDiscount = async () => {
        var newPrice;
        const dealId = window.AMOCRM.data.current_card.id;
        switch (discountType) {
            case "percent":
                newPrice = (product.cost / 100) * (100 - discount);
                break;
            case "price":
                newPrice = product.cost - discount;
                break;
            case "new_price":
                newPrice = discount;
                break
        }
        if (newPrice < 0) {
            store.setError("Цена не может быть ниже нуля.");
            return;
        }
        const productId = '' + product.id;
        await store.itemsEditCost({ [productId]: Math.round(Number(newPrice)) })
    }

    return (
        <li key={product.id} className={styles.productItem} onClick={() => handleToggle(product.id)}>
            <span className={styles.productName}>{product.name}</span>
            <div className={`${styles.expandedInfo} ${expandedProductId === product.id ? styles.expanded : ''}`}>
                <span className={styles.productInfoLine}>Цена: {product.cost === product.price ? product.cost : 
                (<span><s>{product.price}</s> {product.cost}</span>)} ₽</span><br />
                <span className={styles.productInfoLine}>Количество: {product.amount}</span><br />
                <span className={styles.productInfoLine}>Статус: {product.state_}</span><br />
                {isDiscountContOpen ? (
                    <div className={styles.discountWindow} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.discountInput}>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="Скидка"
                            />
                        </div>
                        <div className={styles.discountSelect}>
                            <select name="discountType" onChange={(e) => setDiscountType(e.target.value)}>
                                <option value="percent">Проценты</option>
                                <option value="price">Цена</option>
                                <option value="new_price">Новая цена</option>
                            </select>
                        </div>
                        <div className={styles.discountActions}>
                            <div onClick={async (e) => { discountContClose(e); await handleSaveDiscount(); }} className={styles.discountAction}>
                                Применить скидку
                            </div>
                            <div onClick={discountContClose} className={styles.discountAction}>
                                Закрыть
                            </div>
                        </div>
                    </div>
                ) : (
                    <div onClick={discountContOpen} className={styles.discountButton}>
                        Сделать скидку
                    </div>
                )}
                <div className={styles.deleteButton} onClick={(e) => {
                    e.stopPropagation();
                    if (!isDeleting) handleDelete(product.id);
                }}>
                    { deal.state !== "issued" && (isDeleting ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        <span>&times;</span>
                    ))}
                </div>
            </div>
        </li>
    );
};

export default ProductItem;
