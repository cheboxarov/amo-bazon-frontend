import React, { useEffect, useState } from "react";
import styles from "./DealWindow.module.css";
import DealDetails from "./DealDetails/DealDetails";
import ProductsWindow from "./ProductsWindow/ProductsWindow";
import { BASE_URL } from "../../settings";
import Modal from "./Modal/Modal";
import ChecksList from "./ChecksList/ChecksList";
import CreateWindow from "./CreateWindow/CreateWindow"; // Импортируем компонент модального окна

const DealWindow = ({ store }) => {

    if (store.state.currentDeal.isDealLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <div>Загрузка сделки с Bazon</div>
            </div>
        );
    }

    const error = store.state.currentDeal.productsWindow.error
    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const isModalOpen = store.state.currentDeal.productsWindow.isOpen
    const dealDetails = store.state.currentDeal.dealDetails

    if (!dealDetails) {
        return (
            <CreateWindow store={store} />
        )
    }

    return (
        <div className="DealWindow">
            <DealDetails store={store}/>
            <ProductsWindow store={store}/>
            {isModalOpen && (
                <Modal
                    store={store}
                />
            )}
        </div>
    );
};

export default DealWindow;
