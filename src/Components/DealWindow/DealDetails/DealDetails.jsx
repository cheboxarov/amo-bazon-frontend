// Components/DealDetails.js
import React from 'react';
import styles from './DealDetails.module.css'; // Импортируем стили

const DealDetails = ({ deal }) => {
    return (
        <div className={styles.dealDetailsContainer}>
            <h2 className={styles.dealTitle}>{deal.name}</h2>
            <p className={styles.dealItem}><strong>Номер сделки:</strong> {deal.number}</p>
            <p className={styles.dealItem}><strong>Состояние:</strong> {deal.state_}</p>
            <p className={styles.dealItem}><strong>Контрагент:</strong> {deal.contractorName}</p>
            <p className={styles.dealItem}><strong>Телефон:</strong> {deal.contractorPhone}</p>
            <p className={styles.dealItem}><strong>Сумма:</strong> {deal.sumFull} ₽</p>
            <p className={styles.dealItem}><strong>Комментарий менеджера:</strong> {deal.managerComment}</p>
            <a className={styles.dealLink} href={deal.siteHref} target="_blank" rel="noopener noreferrer">Ссылка на сделку</a>
        </div>
    );
};

export default DealDetails;
