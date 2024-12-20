import React, { useEffect, useState } from "react";
import styles from "./CreateWindow.module.css";

const CreateWindow = ({ store }) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [sources, setSources] = useState({});
    const [storages, setStorages] = useState({});
    const [managers, setManagers] = useState({});
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedStorage, setSelectedStorage] = useState("");
    const [selectedManager, setSelectedManager] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setSources(store.state.currentDeal.sources || {});
        setStorages(store.state.currentDeal.storages || {});
        setManagers(store.state.currentDeal.managers);
    }, [store]);

    const createOpen = () => {
        setError("");
        store.getAmoSource()
        setCreateOpen(true);
    };

    const createClose = () => {
        setCreateOpen(false);
        setError("");
    };

    const handleCreateDeal = async () => {
        if (!comment) {
            setError("Комментарий является обязательным полем.");
            return;
        }

        const dealData = {
            source: selectedSource,
            storage: selectedStorage,
            manager: selectedManager,
            comment,
        };

        setLoading(true);
        try {
            await store.createDeal(dealData);
            createClose();
        } catch (error) {
            setError("Произошла ошибка при создании сделки.");
        } finally {
            setLoading(false);
        }
    };

    if (!isCreateOpen) {
        return (
            <div>
                <div className={styles.buttonContainer}>
                    <div className={styles.button} onClick={createOpen}>
                        Создать сделку
                    </div>
                </div>
            </div>
        );
    } else {
        if (loading) {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <div>Загрузка</div>
                </div>
            );
        }
        if (store.state.currentDeal.amoSource && !selectedSource) {
            Object.entries(sources).map(([key, value]) => {
                console.log(store.state.currentDeal.amoSource.toLowerCase())
                if (value.name.toLowerCase() == store.state.currentDeal.amoSource.toLowerCase()) {
                    setSelectedSource(value.id)
                }
            })
        }

        return (
            <div className={styles.createContainer}>
                <div className={styles.createTitle}>Создание сделки</div>

                <select
                    className={styles.selectField}
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                >
                    <option value="">Выберите источник</option>
                    {Object.entries(sources).map(([key, value]) => {
                        if (value.isSystem) {
                            return null;
                        }
                        return (
                            <option key={key} value={value.id}>
                                {value.name}
                            </option>
                        );
                    })}
                </select>

                {store.state.currentDeal.amoSource && (<div style={{marginBottom: "15px"}}>Источник указанный в сделке: <span style={{color:"green"}}>{store.state.currentDeal.amoSource}</span></div>)}

                <select
                    className={styles.selectField}
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                >
                    <option value="">Выберите склад</option>
                    {Object.entries(storages).map(([key, value]) => (
                        <option key={key} value={value.id}>
                            {value.name}
                        </option>
                    ))}
                </select>

                <select
                    className={styles.selectField}
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                >
                    <option value="">Выберите менеджера</option>
                    {Object.entries(managers).map(([key, value]) => (
                        <option key={key} value={value.id}>
                            {value.nickname}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.buttonContainer}>
                    <div className={styles.button} onClick={handleCreateDeal}>
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

export default CreateWindow;
