import React, {useState} from 'react';
import { FaPrint } from 'react-icons/fa';
import { FiEdit } from "react-icons/fi";
import styles from './DealDetails.module.css';
import ChecksList from "../ChecksList/ChecksList";
import MoveButtons from "./MoveButtons/MoveButtons";
import PayContainer from "./PayContainer/PayContainer";
import EditWindow from "./EditWindow/EditWindow";
import EditableItem from "./EditableItem/EditableItem";
import CreateContractorWindow from './CreateContractorWindow/CreateContractorWindow';

const DealDetails = ({ store }) => {

    const [isEditOpen, setEditOpen] = useState(false)

    const changeEdit = () => {
        setEditOpen(!isEditOpen)
    }

    const onCommentEdit = async (value) => {
        store.state.currentDeal.dealDetails.managerComment = value
        store.fetchDealEdit()
        store.renderDeal()
    }

    const deal = store.state.currentDeal.dealDetails
    const handlePrint = async () => {
        const form = await store.getPrintForm();
        let htmlContent = form.html;
        htmlContent = htmlContent.replace('class="printLogo"', "")
        htmlContent = htmlContent.replace("<img", '<img class="printLogo"')
        console.log(htmlContent)
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
            <CreateContractorWindow store={store} />
        )
    }

    return (
        <div className={styles.dealDetailsContainer}>
            <div className={styles.headerContainer}>
                <h2 className={styles.dealTitle}>{deal.name}</h2>
                <div className={styles.rightButtons}>
                    <div className={styles.printButton} onClick={handlePrint} title="Напечатать чек и накладную">
                        <FaPrint/>
                    </div>
                </div>
            </div>
            <p className={styles.dealItem}><strong>Номер сделки:</strong> {deal.number}</p>
            <p className={styles.dealItem}><strong>Состояние:</strong> {deal.state_}</p>
            <p className={styles.dealItem}>
                <strong>Контрагент:</strong> {deal.contractorName}
                <div className={styles.editButton} onClick={changeEdit}>
                    <FiEdit /> Редактировать
                </div> {/* Кнопка для открытия окна редактирования */}
            </p>
            <p className={styles.dealItem}><strong>Телефон:</strong> {deal.contractorPhone || "Не указан"}</p>
            <p className={styles.dealItem}><strong>Электронная
                    почта:</strong> {deal.contractorEmail || "Не указана"}</p>
            <p className={styles.dealItem}><strong>Сумма:</strong> {deal.sumFull} ₽</p>
            <p className={styles.dealItem}><strong>Комментарий менеджера:</strong> <EditableItem store={store} defaultValue={deal.managerComment} saveHandler={onCommentEdit}/></p>
            <p className={styles.dealItem}><strong>Дата
                    создания:</strong> {new Date(deal.createdAt).toLocaleString()}</p>
            <p className={styles.dealItem}><strong>Менеджер:</strong> {deal.managerName}</p>
            <p className={styles.dealItem}><strong>Способ доставки:</strong> {deal.delivery}</p>
            <p className={styles.dealItem}><strong>Количество товаров:</strong> {deal.itemsCount}</p>
            <p className={styles.dealItem}><strong>Архив:</strong> {deal.isArchive ? "Да" : "Нет"}</p>
            <p className={styles.dealItem}><strong>Комментарий к
                    доставке:</strong> {deal.deliveryComment || "Нет комментариев"}</p>
            <p className={styles.dealItem}><strong>Склад выдачи:</strong> {deal.storageName}</p>
            <a className={styles.dealLink} href={deal.siteHref} target="_blank" rel="noopener noreferrer">Ссылка на
                    сделку</a>
            <MoveButtons store={store} />
            { store.state.currentDeal.dealDetails.state === "reserve" && (<PayContainer store={store} />)}
        </div>
    );
};

export default DealDetails;
