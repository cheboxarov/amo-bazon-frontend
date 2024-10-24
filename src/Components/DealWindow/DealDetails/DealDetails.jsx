import React, { useState } from 'react';
import { FaPrint, FaUndo } from 'react-icons/fa';
import styles from './DealDetails.module.css';
import MoveButtons from "./MoveButtons/MoveButtons";
import PayContainer from "./PayContainer/PayContainer";
import EditableItem from "./EditableItem/EditableItem";
import ContractorWindow from './ContractorWindow/ContractorWindow';
import CreateWindow from '../CreateWindow/CreateWindow';
import CreateContractorWindow from './CreateContractorWindow/CreateContractorWindow'

const DealDetails = ({ store }) => {
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(store.state.currentDeal.dealDetails.storageID || '');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const changeEdit = () => {
        setEditOpen(!isEditOpen);
    };

    const handleStorageSelect = (storageID) => {
        setSelectedStorage(storageID);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const saveStorage = async () => {
        store.state.currentDeal.dealDetails.storageID = selectedStorage;
        await store.fetchDealEdit();
        store.renderDeal();
    };

    const deal = store.state.currentDeal.dealDetails;

    const handlePrint = async () => {
        const form = await store.getPrintForm();
        let htmlContent = form.html;
        htmlContent = htmlContent.replace('class="printLogo"', "");
        htmlContent = htmlContent.replace("<img", '<img class="printLogo"');
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    };

    if (isEditOpen) {
        return (
            <CreateContractorWindow store={store} onClose={()=>{ setEditOpen(false) }} />
        );
    }

    if (!deal) {
        return (<div></div>);
    }

    return (
        <div>
            <div className={styles.dealDetailsContainer}>
                <div className={styles.headerContainer}>
                    <h2 className={styles.dealTitle}>{deal.name}</h2>
                    <div className={styles.rightButtons}>
                        <div className={styles.printButton} onClick={async () => { store.sendAmoUpdate(); }} title="Актуализировать сделку">
                            <FaUndo />
                        </div>
                        <div className={styles.printButton} onClick={handlePrint} title="Напечатать чек и накладную">
                            <FaPrint />
                        </div>
                    </div>
                </div>

                <div className={styles.dealItem}>
                    <strong>Склад выдачи:</strong>
                    <div className={styles.dropdownContainer}>
                        <div className={styles.dropdownButton} onClick={toggleDropdown}>
                            {selectedStorage ? store.state.currentDeal.storages[selectedStorage].name : "Выберите склад"}
                        </div>
                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                {store.state.currentDeal.storages && typeof store.state.currentDeal.storages === 'object' ? (
                                    Object.values(store.state.currentDeal.storages).map((storage) => (
                                        <div
                                            key={storage.id}
                                            className={styles.dropdownItem}
                                            onClick={() => handleStorageSelect(storage.id)}
                                        >
                                            {storage.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.dropdownItemDisabled}>Склады не найдены</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.saveButton} onClick={saveStorage}>Сохранить</div>
                </div>

                <p className={styles.dealItem}><strong>Номер сделки:</strong> {deal.number}</p>
                <p className={styles.dealItem}><strong>Состояние:</strong> {deal.state_}</p>
                <p className={styles.dealItem}><strong>Контрагент:</strong> {deal.contractorName}</p>
                <p className={styles.dealItem}><strong>Телефон:</strong> {deal.contractorPhone || "Не указан"}</p>
                <p className={styles.dealItem}><strong>Электронная почта:</strong> {deal.contractorEmail || "Не указана"}</p>
                <p className={styles.dealItem}><strong>Сумма:</strong> {deal.sumFull} ₽</p>
                <p className={styles.dealItem}><strong>Комментарий менеджера:</strong> <EditableItem store={store} defaultValue={deal.managerComment} saveHandler={(value) => { store.state.currentDeal.dealDetails.managerComment = value; store.fetchDealEdit(); store.renderDeal(); }} /></p>
                <p className={styles.dealItem}><strong>Дата создания:</strong> {new Date(deal.createdAt).toLocaleString()}</p>
                <p className={styles.dealItem}><strong>Менеджер:</strong> {deal.managerName}</p>
                <p className={styles.dealItem}><strong>Способ доставки:</strong> {deal.delivery}</p>
                <p className={styles.dealItem}><strong>Количество товаров:</strong> {deal.itemsCount}</p>
                <p className={styles.dealItem}><strong>Архив:</strong> {deal.isArchive ? "Да" : "Нет"}</p>
                <p className={styles.dealItem}><strong>Комментарий к доставке:</strong> {deal.deliveryComment || "Нет комментариев"}</p>
                <a className={styles.dealLink} href={deal.siteHref} target="_blank" rel="noopener noreferrer">Ссылка на сделку</a>
                <MoveButtons store={store} />
                {store.state.currentDeal.dealDetails.state === "reserve" && (<PayContainer store={store} />)}
            </div>
            <ContractorWindow onEditHandle={changeEdit} store={store} />
        </div>
    );
};

export default DealDetails;
