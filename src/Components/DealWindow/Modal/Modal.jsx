import React, { useState, useEffect } from "react";
import styles from './Modal.module.css'; // Импорт стилей для модального окна
import ProductDetails from './ProductDetails/ProductDetails';
import { BASE_URL } from "../../../settings";
import ModalProductItem from "./ProductItem/ModalProductItem";
import Pagination from "./Pagination/Pagination";
import SearchTab from "./SearchTab/SearchTab";
import mainStyles from "../DealWindow.module.css";

const Modal = ({ onClose, products, onSearch, dealProducts,
                   isProductsLoading, setProductsLoading, closeModal, updateDeal, deal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [quantities, setQuantities] = useState({});
    const [initialQuantities, setInitialQuantities] = useState({});
    const [progress, setProgress] = useState(0); // Добавляем состояние для прогресса

    const screenHeight = screen.height;
    const itemsPerPage = Math.ceil(screenHeight / 70);

    useEffect(() => {
        const initial = {};
        dealProducts.forEach(product => {
            initial[product.id] = product.amount;
        });
        setQuantities(initial);
        setInitialQuantities(initial); // Сохраняем начальные количества
    }, [dealProducts]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closeDetails = () => {
        setSelectedProduct(null);
    };

    const handleSearch = async () => {
        setCurrentPage(1);
        setProductsLoading(true);
        const response = await fetch(`${BASE_URL}/bazon-items/tematechnics?search=${searchTerm}`);

        if (response.ok) {
            const results = await response.json();
            onSearch(results);
        } else {
            console.error(response);
        }
        setProductsLoading(false);
    };

    const handleSave = async () => {
        const dealId = window.AMOCRM.data.current_card.id;
        const itemsToUpdate = Object.keys(quantities)
            .filter(id => quantities[id] > 0 && quantities[id] !== initialQuantities[id]);
        setProgress(1)

        for (let i = 0; i < itemsToUpdate.length; i++) {
            const id = itemsToUpdate[i];
            const response = await fetch(`${BASE_URL}/bazon-sale/${dealId}/add-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "dealId": dealId,
                    "items": [
                        {
                            storageId: deal.storageID,
                            productId: id,
                            quantity: quantities[id],
                        }
                    ],
                })
            });
            if (response.ok) {
                setProgress(((i + 1) / itemsToUpdate.length) * 100); // Обновляем прогресс
            }
        }
        closeModal();
        updateDeal();
    };

    // Проверка, изменились ли количества
    const hasQuantitiesChanged = () => {
        return Object.keys(quantities)
            .filter(id => quantities[id] > 0) // Фильтруем ключи, оставляя только те, где quantity больше 0
            .some(id => quantities[id] !== initialQuantities[id]); // Проверяем, изменились ли значения
    };

    if (isProductsLoading) {
        return (
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <div className={mainStyles.loading}>
                        <div className={mainStyles.spinner}></div>
                        <div>Загрузка товаров с Bazon</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Выберите товары для добавления</h2>

                {/* Поле поиска и кнопка */}
                <SearchTab setSearchTerm={setSearchTerm} handleSearch={handleSearch} searchTerm={searchTerm} />

                {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <ModalProductItem
                            key={product.id} // Добавляем ключ для рендеринга списка
                            product={product}
                            handleProductClick={handleProductClick}
                            setQuantities={setQuantities}
                            quantities={quantities}
                        />
                    ))
                ) : (
                    <div>Нет доступных товаров на складе</div>
                )}

                {/* Кнопка "Сохранить" */}
                {hasQuantitiesChanged() && (
                    <div className={styles.saveButton} onClick={handleSave}>
                        Сохранить
                    </div>
                )}

                {/* Прогресс-бар */}
                {progress > 0 && (<div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{width: `${progress}%`}}></div>
                </div>)}

                {/* Пагинация */}
                <Pagination currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} totalPages={totalPages} />
            </div>

            {/* Условный рендеринг ProductDetails */}
            {selectedProduct && (
                <ProductDetails product={selectedProduct} onClose={closeDetails} />
            )}
        </div>
    );
};

export default Modal;
