import React from "react";

import styles from "./MoveButtons.module.css"

const MoveButtons = ({ store }) => {
    const deal = store.state.currentDeal.dealDetails

    const reserveDeal = store.reserveDeal.bind(store)
    const cancelDeal = store.cancelDeal.bind(store)
    const issueDeal = store.issueDeal.bind(store)
    const recreateDeal = store.recreateDeal.bind(store)

    switch (deal.state) {
        case "reserve":
            if (Number(deal.paid) === Number(deal.sumFull)) {
                return (
                    <div className={styles.moveButtonsContainer}>
                        <div className={styles.moveButton} onClick={issueDeal}>
                            Выдать
                        </div>
                        <div className={styles.declineButton} onClick={cancelDeal}>
                            Отменить
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={styles.moveButtonsContainer}>
                        <div className={styles.declineButton} onClick={cancelDeal}>
                            Отменить
                        </div>
                    </div>
                )
            }
        case "draft":
            if (store.state.currentDeal.dealProducts.length) {
                return (
                    <div className={styles.moveButtonsContainer}>
                        <div className={styles.moveButton} onClick={reserveDeal}>
                            Зарезервировать
                        </div>
                        <div className={styles.declineButton} onClick={cancelDeal}>
                            Отменить
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={styles.moveButtonsContainer}>
                        <div className={styles.declineButton} onClick={cancelDeal}>
                            Отменить
                        </div>
                    </div>
                )
            }
        case "canceled":
            return (
                <div className={styles.moveButtonsContainer}>
                    <div className={styles.moveButton} onClick={recreateDeal}>
                        Вернуть в работу
                    </div>
                </div>
            )
    }
    return (<div></div>)
}

export default MoveButtons;