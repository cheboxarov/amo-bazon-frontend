import React, {useEffect, useState} from "react";
import styles from "../../App.module.css";
import DealDetails from "./DealDetails/DealDetails";
import ProductsWindow from "./ProductsWindow/ProductsWindow";
import {BASE_URL} from "../../settings";

const DealWindow = () => {
    const [products, setProducts] = useState([]);
    const [deal, setDeal] = useState(null); // Состояние для деталей сделки
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const dealId = window.AMOCRM.data.current_card.id; // Получаем ID сделки
        // Запрос к вашему API для получения товаров по ID сделки
        fetch(`${BASE_URL}/bazon-sale/${dealId}/detail`)
            .then(response => {
                if (!response.ok) {
                    console.log(response)
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setProducts(data.items); // Устанавливаем полученные товары в состояние
                setDeal(data.document.Document); // Устанавливаем детали сделки в состояние
            })
            .catch(error => {
                console.error('Ошибка при получении товаров:', error);
                setError('Ошибка при загрузке товаров');
            })
            .finally(() => {
                setLoading(false); // Сбрасываем состояние загрузки
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <div>Загрузка сделки с Bazon</div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className="DealWindow">
            {deal && <DealDetails deal={deal} />} {/* Отображаем детали сделки */}
            <ProductsWindow products={products} />
        </div>
    );
}
export default DealWindow