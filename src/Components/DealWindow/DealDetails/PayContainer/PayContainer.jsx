import React from "react";
import AddPayContainer from "./AddPayContainer/AddPayContainer";
import PayBackContainer from "./PayBackContainer/PayBackContainer";

const PayContainer = ({ store }) => {
    const deal = store.state.currentDeal.dealDetails
    return (
        <React.Fragment>
            { Number(deal.paid) !== Number(deal.sumFull) && (<AddPayContainer store={store} />)}
            <PayBackContainer store={store} />
        </React.Fragment>
    );
};

export default PayContainer;
