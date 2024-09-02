import React, { useEffect, useState } from "react";
import styles from "./DealWindow.module.css";
import DealDetails from "./DealDetails/DealDetails";
import ProductsWindow from "./ProductsWindow/ProductsWindow";
import { BASE_URL } from "../../settings";
import Modal from "./Modal/Modal"; // Импортируем компонент модального окна

const DealWindow = () => {
    const [products, setProducts] = useState([]);
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [allWarehouseProducts, setAllWarehouseProducts] = useState([]); // Все товары на складе
    const [isProductsLoading, setProductsLoading] = useState(false)

    useEffect(() => {
        const dealId = window.AMOCRM.data.current_card.id; // Получаем ID сделки

        // Запрос к вашему API для получения товаров по ID сделки
        fetch(`${BASE_URL}/bazon-sale/${dealId}/detail`)
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error('Ошибка при получении сделки');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setProducts(data.items); // Устанавливаем товары прикрепленные к сделке
                setDeal(data.document.Document);
            })
            .catch(error => {
                console.error('Ошибка при получении сделки:', error);
                setError('Ошибка при загрузке сделки');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const fetchAllWarehouseProducts = () => {
        setProductsLoading(true)
        fetch(`${BASE_URL}/bazon-items/tematechnics`) // Запрос на получение всех товаров
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении товаров на складе');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setProductsLoading(false)
                setAllWarehouseProducts(data); // Устанавливаем все товары на складе
            })
            .catch(error => {
                console.error('Ошибка при получении товаров на складе:', error);
            });
    };

    const onSearch = (items) => {
        setAllWarehouseProducts(items);
    }

    const openModal = () => {
        fetchAllWarehouseProducts(); // Загружаем товары перед открытием модального окна
        setModalVisible(true);

        // Скрываем элемент notes-wrapper на странице
        const notesWrapper = document.querySelector('.notes-wrapper');
        if (notesWrapper) {
            notesWrapper.style.display = 'none'; // Скрываем элемент
        }
    };

    const closeModal = () => {
        setModalVisible(false);

        // Восстанавливаем элемент notes-wrapper на странице
        const notesWrapper = document.querySelector('.notes-wrapper');
        if (notesWrapper) {
            notesWrapper.style.display = ''; // Восстанавливаем элемент
        }
    };

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
            {deal && <DealDetails deal={deal}/>}
            <ProductsWindow products={products} openModal={openModal}/>

            {modalVisible && (
                <Modal onClose={closeModal} products={allWarehouseProducts} dealProducts={products}
                       onSearch={onSearch} isProductsLoading={isProductsLoading}
                       setProductsLoading={setProductsLoading}/>
            )}
        </div>
    );
};

export default DealWindow;
