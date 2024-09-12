import React from "react";
import AddPayContainer from "./AddPayContainer/AddPayContainer";
import PayBackContainer from "./PayBackContainer/PayBackContainer";

const PayContainer = ({ store }) => {
    return (
        <React.Fragment>
            <AddPayContainer store={store} />
            <PayBackContainer store={store} />
        </React.Fragment>
    );
};

export default PayContainer;
