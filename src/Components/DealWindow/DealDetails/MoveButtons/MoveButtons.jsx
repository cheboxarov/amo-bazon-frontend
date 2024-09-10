import React from "react";

import styles from "./MoveButtons.module.css"

const MoveButtons = ({ store }) => {
    const deal = store.state.currentDeal.dealDetails

    const reserveDeal = store.reserveDeal.bind(store)
    const cancelDeal = store.cancelDeal.bind(store)
    const giveDeal = store.giveDeal.bind(store)

    switch (deal.state) {
        case "reserve":
            return (
                <div className={styles.moveButtonsContainer}>
                    <div className={styles.moveButton} onClick={giveDeal}>
                        Выдать
                    </div>
                    <div className={styles.declineButton} onClick={cancelDeal}>
                        Отменить
                    </div>
                </div>
            )
        case "draft":
            return (
                <div className={styles.moveButtonsContainer}>
                    <div className={styles.moveButton} onClick={reserveDeal}>
                        Зарезериваровать
                    </div>
                    <div className={styles.declineButton} onClick={cancelDeal}>
                        Отменить
                    </div>
                </div>
            )
    }
    return (<div></div>)
}

export default MoveButtons;