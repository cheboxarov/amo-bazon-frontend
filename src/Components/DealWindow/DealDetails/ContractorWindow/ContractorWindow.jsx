import React from 'react';
import styles from './ContractorWindow.module.css';

const ContractorWindow = ({ onEditHandle, store }) => {
    const Contractor = store.state.currentDeal.contractor;
    if (!Contractor) {
        return null;
    }

    if (Contractor.id == 1) {
        return (
            <div>
                <div className={styles.dealDetailsContainer}>
                    <div className={styles.headerContainer}>
                        <div className={styles.dealTitle}>
                            Контрагент: {Contractor.name || 'Нет имени'}
                        </div>
                        <div className={styles.rightButtons}>
                            <button className={styles.editButton} onClick={onEditHandle} title="Редактировать">
                                ✏️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.dealDetailsContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.dealTitle}>
                    Контрагент: {Contractor.name || 'Нет имени'}
                </div>
                <div className={styles.rightButtons}>
                    <button className={styles.editButton} onClick={onEditHandle} title="Редактировать">
                        ✏️
                    </button>
                </div>
            </div>

            <div className={styles.dealItem}>
                <strong>ИНН:</strong> {Contractor.INN}
            </div>
            <div className={styles.dealItem}>
                <strong>Телефон:</strong> {Contractor.phone}
            </div>
            <div className={styles.dealItem}>
                <strong>Email:</strong> {Contractor.email}
            </div>
            <div className={styles.dealItem}>
                <strong>Баланс:</strong> {Contractor.balance}
            </div>
            <div className={styles.dealItem}>
                <strong>Баланс (свободный):</strong> {Contractor.balanceFree}
            </div>
            <div className={styles.dealItem}>
                <strong>Дата создания:</strong> {Contractor.createdAt}
            </div>
            <div className={styles.dealItem}>
                <strong>Тип:</strong> {Contractor.legalType_}
            </div>
            <div className={styles.dealLink}>
                Подробнее о контрагенте
            </div>
        </div>
    );
};

export default ContractorWindow;
