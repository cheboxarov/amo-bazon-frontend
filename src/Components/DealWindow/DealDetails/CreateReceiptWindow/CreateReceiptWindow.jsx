import React, { useEffect, useState } from "react";
import styles from "./CreateReceiptWindow.module.css";
import { createReceipt, getReceipts } from "../../../../api/receiptsApi";

const CreateReceiptWindow = ({ store }) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [cashMachines, setCashMachines] = useState({});
    const [contact, setContact] = useState("");
    const [cash, setCash] = useState("");
    const [electron, setElectron] = useState("");
    const [selectedCashMachine, setSelectedCashMachine] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sum, setSum] = useState(0)

    useEffect(() => {
        setCashMachines(store.state.currentDeal.cashMachines || {});
        setSum(store.state.currentDeal.dealDetails.sum)
    }, [store]);

    const createOpen = () => {
        setError("");
        setCreateOpen(true);
    };

    const createClose = () => {
        setCreateOpen(false);
        setError("");
    };

    const handleCreateReceipt = async () => {
        if (!contact || !cash || !electron || !selectedCashMachine) {
            setError("Пожалуйста, заполните все поля.");
            return;
        }
        if(cash + electron != sum) {
            setError(`Пожалуйста введите всю сумму (${sum}).`);
            return;
        }
        setLoading(true);
        try {
            const response = await createReceipt(
                store.state.currentDeal.dealId,
                selectedCashMachine,
                selectedCashMachine,
                contact,
                Number(cash),
                Number(electron)
            )
            if(!response.response.saleReceiptProcess.success) {
                const errorCode = response.response.saleReceiptProcess.error
                const errors = {
                    "SALE_RECEIPTS_NOT_REFUNDED": "Уже оплачено." 
                }
                setError(`Произошла ошибка при создании чека. ${errors[errorCode]}`)
                setLoading(true);
                return
            }
            createClose();
        } catch (error) {
            console.error(error)
            setError("Произошла ошибка при создании чека.");
        } finally {
            setLoading(false);
        }
    };

    if (!isCreateOpen) {
        if (store.state.currentDeal.dealDetails.fiscallyReceiptsIDs.length - store.state.currentDeal.dealDetails.fiscallyRefundedSum != 0)
            return null
        return (
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={createOpen}>
                    Создать чек
                </div>
            </div>
        );
    } else {
        if (loading) {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <div>Загрузка...</div>
                </div>
            );
        }

        return (
            <div className={styles.createReceiptContainer}>
                <div className={styles.createReceiptTitle}>Создание чека</div>

                <select
                    className={styles.selectField}
                    value={selectedCashMachine}
                    onChange={(e) => setSelectedCashMachine(e.target.value)}
                >
                    <option value="">Выберите кассу</option>
                    {Object.entries(cashMachines).map(([key, value]) => (
                        <option key={key} value={value.factoryNumber}>
                            {value.label}
                        </option>
                    ))}
                </select>

                <input
                    type="email"
                    className={styles.inputField}
                    placeholder="Контакт (например, email)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />

                <input
                    type="number"
                    className={styles.inputField}
                    placeholder="Сумма наличных"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                />

                <input
                    type="number"
                    className={styles.inputField}
                    placeholder="Сумма электронных"
                    value={electron}
                    onChange={(e) => setElectron(e.target.value)}
                />

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.buttonsContainer}>
                    <div className={styles.button} onClick={handleCreateReceipt}>
                        Создать
                    </div>
                    <div className={styles.closeButton} onClick={createClose}>
                        Отменить
                    </div>
                </div>
            </div>
        );
    }
};

export default CreateReceiptWindow;
