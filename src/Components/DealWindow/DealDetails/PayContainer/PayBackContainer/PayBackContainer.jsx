import React, { useEffect, useState } from "react";
import styles from "./PayBackContainer.module.css";

const PayBackContainer = ({ store }) => {
    const [isPayBackOpen, setPayBackOpen] = useState(false);
    const [payBackAmount, setPayBackAmount] = useState('');
    const [payBackSource, setPayBackSource] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const openPayBack = () => {
        setPayBackOpen(true);
        setError('');
    };

    const closePayBack = () => {
        setPayBackOpen(false);
        setError('');
    };

    const deal = store.state.currentDeal.dealDetails;

    if (deal.paid === 0) {
        return null;
    }

    const sources = store.state.currentDeal.paySources;
    const _paidSources = store.state.currentDeal.paidSources;
    const paidSources = [];

    Object.entries(_paidSources).forEach(([key, value]) => {
        sources.forEach((source) => {
            if (source.id === Number(key)) {
                paidSources.push({
                    ...source,
                    paid: value,
                });
            }
        });
    });

    const handlePayBack = async () => {
        if (!comment) {
            setError("Комментарий является обязательным полем.");
            return;
        }
        
        console.log(payBackAmount, payBackSource, comment);
        await store.dealPayBack(payBackAmount, payBackSource, comment);
        closePayBack();
    };

    if (isPayBackOpen) {
        return (
            <div className={styles.payContainer}>
                <div className={styles.payTitle}>Вернуть оплату.</div>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Введите сумму"
                    value={payBackAmount}
                    onChange={(e) => setPayBackAmount(e.target.value)}
                />
                <select
                    className={styles.selectField}
                    value={payBackSource}
                    onChange={(e) => setPayBackSource(e.target.value)}
                >
                    <option value="" disabled>Выберите источник оплаты</option>
                    {paidSources.map(source => {
                        if (source.paid) {
                            return (
                                <option key={source.id} value={source.id}>
                                    {source.name} ({source.paid})
                                </option>
                            );
                        }
                    })}
                </select>

                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.button} onClick={handlePayBack}>
                    Сохранить
                </div>
                <div className={styles.closeButton} onClick={closePayBack}>
                    Закрыть
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={openPayBack}>
                    Сделать возврат средств
                </div>
            </div>
        );
    }
};

export default PayBackContainer;
