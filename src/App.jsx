// App.js

import React, { useEffect, useState } from 'react';
import ProductsWindow from "./Components/DealWindow/ProductsWindow/ProductsWindow";
import DealDetails from "./Components/DealWindow/DealDetails/DealDetails"; // Импортируем компонент для сделки
import styles from "./App.module.css";
import DealWindow from "./Components/DealWindow/DealWindow";
import PipelineMarker from "./Components/PipelineMarker/PipelineMarker";

const App = () => {
    return <DealWindow />
};

export default App;
