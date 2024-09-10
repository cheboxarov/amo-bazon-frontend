import React, { useState, useEffect } from "react";
import styles from './Modal.module.css'; // Импорт стилей для модального окна
import ProductDetails from './ProductDetails/ProductDetails';
import ModalProductItem from "./ProductItem/ModalProductItem";
import Pagination from "./Pagination/Pagination";
import SearchTab from "./SearchTab/SearchTab";
import mainStyles from "../DealWindow.module.css";

const Modal = ({ store }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [quantities, setQuantities] = useState({});
    const [initialQuantities, setInitialQuantities] = useState({});
    const [progress, setProgress] = useState(0);

    const screenHeight = screen.height;
    const itemsPerPage = Math.ceil(screenHeight / 70);

    const dealProducts = store.state.currentDeal.dealProducts;

    useEffect(() => {
        const initial = {};
        dealProducts.forEach(product => {
            initial[product.id] = product.amount;
        });
        setQuantities(initial);
        setInitialQuantities(initial);
    }, [dealProducts]);

    const products = store.state.currentDeal.productsWindow.products;
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
        await store.updateProductsWindow(searchTerm);
    };

    const handleSave = async () => {
        await store.saveDealProducts(quantities, initialQuantities, setProgress);
    };

    const hasQuantitiesChanged = () => {
        return Object.keys(quantities)
            .filter(id => quantities[id] > 0)
            .some(id => quantities[id] !== initialQuantities[id]);
    };

    if (store.state.currentDeal.productsWindow.isLoading) {
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
                <span className={styles.close} onClick={store.closeProductsWindow.bind(store)}>&times;</span>
                <h2>Выберите товары для добавления</h2>

                {/* Поле поиска и кнопка */}
                <SearchTab setSearchTerm={setSearchTerm} handleSearch={handleSearch} searchTerm={searchTerm} />

                {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <ModalProductItem
                            key={product.id}
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
                    <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
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
