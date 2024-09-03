import React from 'react';
import styles from './DealDetails.module.css';
import ChecksList from "../ChecksList/ChecksList"; // Импортируем стили

const DealDetails = ({ deal }) => {
    console.log(deal); // Для отладки

    return (
        <div className={styles.dealDetailsContainer}>
                <h2 className={styles.dealTitle}>{deal.name}</h2>
                <p className={styles.dealItem}><strong>Номер сделки:</strong> {deal.number}</p>
                <p className={styles.dealItem}><strong>Состояние:</strong> {deal.state_}</p>
                <p className={styles.dealItem}><strong>Контрагент:</strong> {deal.contractorName}</p>
                <p className={styles.dealItem}><strong>Телефон:</strong> {deal.contractorPhone || "Не указан"}</p>
                <p className={styles.dealItem}><strong>Электронная
                        почта:</strong> {deal.contractorEmail || "Не указана"}</p>
                <p className={styles.dealItem}><strong>Сумма:</strong> {deal.sumFull} ₽</p>
                <p className={styles.dealItem}><strong>Комментарий менеджера:</strong> {deal.managerComment}</p>
                <p className={styles.dealItem}><strong>Дата
                        создания:</strong> {new Date(deal.createdAt).toLocaleString()}</p>
                <p className={styles.dealItem}><strong>Менеджер:</strong> {deal.managerName}</p>
                <p className={styles.dealItem}><strong>Способ доставки:</strong> {deal.delivery}</p>
                <p className={styles.dealItem}><strong>Количество товаров:</strong> {deal.itemsCount}</p>
                <p className={styles.dealItem}><strong>Архив:</strong> {deal.isArchive ? "Да" : "Нет"}</p>
                <p className={styles.dealItem}><strong>Комментарий к
                        доставке:</strong> {deal.deliveryComment || "Нет комментариев"}</p>
                <p className={styles.dealItem}><strong>Склад выдачи:</strong> {deal.storageName}</p>
                <a className={styles.dealLink} href={deal.siteHref} target="_blank" rel="noopener noreferrer">Ссылка на
                        сделку</a>
            <ChecksList/>
        </div>
    );
};

export default DealDetails;
