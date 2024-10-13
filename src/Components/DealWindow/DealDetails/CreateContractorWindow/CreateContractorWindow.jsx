import React, { useState } from "react";
import styles from "./CreateContractorWindow.module.css";

const CreateContractorWindow = ({ store, onClose }) => {
    const [isCreateOpen, setCreateOpen] = useState(true);
    const deal = store.state.currentDeal.dealDetails
    const [name, setName] = useState(deal.contractorName);
    const [phone, setPhone] = useState(deal.contractorPhone);
    const [email, setEmail] = useState(deal.contractorEmail);
    const [BIK, setBIK] = useState("");
    const [INN, setINN] = useState("");
    const [KPP, setKPP] = useState("");
    const [bankName, setBankName] = useState("");
    const [legalName, setLegalName] = useState("");
    const [legalAddress, setLegalAddress] = useState("");
    const [realAddress, setRealAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const createClose = () => {
        onClose();
    };

    const handleCreateContractor = async () => {
        setLoading(true);
        const contractorData = {
            name,
            phone,
            email,
            BIK,
            INN,
            KPP,
            bank_name: bankName,
            legal_name: legalName,
            legal_address: legalAddress,
            real_adress: realAddress,
        };
        var contractodID = store.state.currentDeal.dealDetails.contractorID
        if (contractodID != 1) {
            contractorData.id = contractodID
        }
        await store.createContractor(contractorData);
        setLoading(false);
        createClose();
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <div>Загрузка</div>
            </div>
        );
    }

    return (
        <div className={styles.createContainer}>
            <div className={styles.createTitle}>Создание контрагента</div>

            <input
                type="text"
                className={styles.inputField}
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="БИК"
                value={BIK}
                onChange={(e) => setBIK(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="ИНН"
                value={INN}
                onChange={(e) => setINN(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="КПП"
                value={KPP}
                onChange={(e) => setKPP(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Название банка"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Юридическое название"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Юридический адрес"
                value={legalAddress}
                onChange={(e) => setLegalAddress(e.target.value)}
            />

            <input
                type="text"
                className={styles.inputField}
                placeholder="Фактический адрес"
                value={realAddress}
                onChange={(e) => setRealAddress(e.target.value)}
            />

            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={handleCreateContractor}>
                    Создать
                </div>
                <div className={styles.closeButton} onClick={createClose}>
                    Отменить
                </div>
            </div>
        </div>
    );
};

export default CreateContractorWindow;
