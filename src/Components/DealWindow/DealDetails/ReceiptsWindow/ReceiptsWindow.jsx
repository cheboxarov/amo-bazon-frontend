import { useEffect, useState } from "react";
import React from "react";
import styles from "./ReceiptsWindow.module.css"; // Импорт модульных стилей

const ReceiptsWindow = ({ store }) => {
    const [opened, setOpened] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (store.state.currentDeal && store.state.currentDeal.receipts) {
            setReceipts(store.state.currentDeal.receipts);
            setLoading(false);
        } else {
            setReceipts([]);
            setLoading(false);
        }
    }, [store]);

    if (!opened) {
        if (store.state.currentDeal.dealDetails.fiscallyReceiptsIDs.length < 1) {
            return null
        }
        return (
            <div className={styles.button} onClick={() => setOpened(true)}>
                Чеки
            </div>
        );
    } else {
        return (
            <div className={styles.createReceiptContainer}>
                <div className={styles.closeButton} onClick={() => setOpened(false)}>
                    Закрыть
                </div>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        Загрузка чеков...
                    </div>
                ) : (
                    receipts.map((receipt, index) => (
                        <div key={index} className={styles.receiptItem}>
                            <p><strong>Тип операции:</strong> {receipt.operationType_}</p>
                            <p><strong>Номер документа:</strong> {receipt.documentNumber}</p>
                            <p><strong>Сумма:</strong> {receipt._columns.sum}</p>
                            <p><strong>Кассир:</strong> {receipt._columns.cashierString}</p>
                        </div>
                    ))
                )}
            </div>
        );
    }
};

export default ReceiptsWindow;
