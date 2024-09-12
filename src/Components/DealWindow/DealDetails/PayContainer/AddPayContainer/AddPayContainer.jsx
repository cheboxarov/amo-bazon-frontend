import React, {useEffect, useState} from "react";
import styles from './AddPayContainer.module.css'; // Импортируем стили

const AddPayContainer = ({ store }) => {
    const [isPayOpen, setPayOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [selectedSource, setSelectedSource] = useState('');

    const deal = store.state.currentDeal.dealDetails
    const payLast = deal.sumFull - deal.paid

    if (payLast === 0) {
        return null;
    }

    const openPay = () => {
        setPayOpen(true);
    };

    const closePay = () => {
        setPayOpen(false);
    };



    const sources = store.state.currentDeal.paySources

    const handleSubmit = async () => {
        await store.addDealPay(amount, selectedSource, comment)
        closePay();
    };


    if (isPayOpen) {
        return (
            <div className={styles.payContainer}>
                <div className={styles.payTitle}>Добавить оплату. Осталось {payLast} р. </div>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Введите комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <select
                    className={styles.selectField}
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                >
                    <option value="" disabled>Выберите источник оплаты</option>
                    {sources.map(source => (
                        <option key={source.id} value={source.id}>
                            {source.name}
                        </option>
                    ))}
                </select>
                <div className={styles.button} onClick={handleSubmit}>
                    Сохранить
                </div>
                <div className={styles.closeButton} onClick={closePay}>
                    Закрыть
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={openPay}>
                    Добавить оплату
                </div>
            </div>
        );
    }
};

export default AddPayContainer;
