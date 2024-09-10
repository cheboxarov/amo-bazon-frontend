// Components/ChecksList.js
import React, { useEffect, useState } from 'react';
import styles from './ChecksList.module.css'; // Импорт стилей
import {BASE_URL} from "../../../settings";

const ChecksList = ({ store }) => {

    const loading = store.state.currentDeal.orders.isOrdersLoading
    const error = store.state.currentDeal.orders.error
    const checks = store.state.currentDeal.orders.entitys

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <div>Загрузка чеков...</div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!checks.length) {
        return null;
    }

    return (
        <div className={styles.checksContainer}>
            {checks.map((check) => {
                let checkType = "Входящий"
                if (check.type === "income") {
                    checkType = "Входящий"
                }
                return(
                <div key={check.id} className={styles.checkItem}>
                    <div className={styles.checkTitle}>Чек №{check.document_number}</div>
                    <div className={styles.checkDetail}>Сумма: {check.sum}₽</div>
                    <div className={styles.checkDetail}>Тип: {checkType}</div>
                    <div className={styles.checkDetail}>Создан: {new Date(check.created_at).toLocaleString()}</div>
                </div>
            )})}
        </div>
    );
};

export default ChecksList;
