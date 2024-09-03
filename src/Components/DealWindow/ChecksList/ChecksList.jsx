// Components/ChecksList.js
import React, { useEffect, useState } from 'react';
import styles from './ChecksList.module.css'; // Импорт стилей
import {BASE_URL} from "../../../settings";

const ChecksList = () => {
    const [checks, setChecks] = useState([]); // Состояние для чеков
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибок

    useEffect(() => {
        const fetchChecks = async () => {
            try {
                const dealId = window.AMOCRM.data.current_card.id;
                const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/orders`); // Ваш API для получения чеков
                if (!response.ok) {
                    throw new Error('Ошибка при получении чеков');
                }
                const data = await response.json();
                setChecks(data); // Установка чеков в состояние
            } catch (error) {
                console.error('Ошибка:', error);
                setError('Ошибка при загрузке чеков');
            } finally {
                setLoading(false);
            }
        };

        fetchChecks();
    }, []);

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
