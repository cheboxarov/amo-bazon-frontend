import React from "react";
import styles from "./PipelineMarker.module.css"; // Импортируем модульный CSS

const PipelineMarker = () => {
    return (
        <div className={styles.pipelineMarker}>
            <span className={styles.pipelineMarkerText}>Bazon</span>
        </div>
    );
};

export default PipelineMarker;
