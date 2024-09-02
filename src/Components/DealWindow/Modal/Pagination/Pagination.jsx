import styles from "./Pagination.module.css";
import React from "react";

const Pagination = ({ currentPage, prevPage, totalPages, nextPage }) => {
    return (
        <div className={styles.pagination}>
        <div
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={prevPage}
            style={{cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}} // Set cursor based on state
        >
            Назад
        </div>
        <span>{`Страница ${currentPage} из ${totalPages}`}</span>
        <div
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={nextPage}
            style={{cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}} // Set cursor based on state
        >
            Вперед
        </div>
    </div>
    )
}
export default Pagination