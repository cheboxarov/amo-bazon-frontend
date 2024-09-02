import styles from "./SearchTab.module.css";
import React from "react";

const SearchTab = ({ searchTerm, setSearchTerm, handleSearch }) => {
    return (
        <div className={styles.searchContainer}>
        <input
            type="text"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск товаров..."
        />
        <div className={styles.searchButton} onClick={handleSearch}>
            Поиск
        </div>
    </div>
    )
}

export default SearchTab