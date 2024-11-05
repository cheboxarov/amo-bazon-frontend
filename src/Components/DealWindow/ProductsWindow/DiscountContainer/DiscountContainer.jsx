import React, { useState } from "react";
import styles from "./DiscountContainer.module.css";

const DiscountContainer = ({ store }) => {
    const [isDiscountContOpen, setDiscountContOpen] = useState(false);
    const [discount, setDiscount] = useState("");

    const discountContClose = () => {
        setDiscountContOpen(false);
        setDiscount("");
    };

    const discountContOpen = () => {
        setDiscountContOpen(true);
        setDiscount("");
    };

    const handleApplyDiscount = async () => {
        if (discount <= 0 || discount >= 100) {
            store.setError("Введите процент скидки от 1 до 99.");
            return;
        }
        const updatedPrices = {}
        store.state.currentDeal.dealProducts.forEach((product) => {
            updatedPrices[""+product.id] = product.cost - (product.cost / 100 * discount)
        })

        await store.itemsEditCost(updatedPrices);
    };

    return (
        <div>
            {isDiscountContOpen ? (
                <div className={styles.discountWindow} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.discountInput}>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="Скидка %"
                        />
                    </div>
                    <div className={styles.discountActions}>
                        <div onClick={async (e) => { discountContClose(e); await handleApplyDiscount(); }} className={styles.discountAction}>
                            Применить ко всем
                        </div>
                        <div onClick={discountContClose} className={styles.discountAction}>
                            Закрыть
                        </div>
                    </div>
                </div>
            ) : (
                <div onClick={discountContOpen} className={styles.discountButton}>
                    Сделать скидку на все
                </div>
            )}
        </div>
    );
};

export default DiscountContainer;
