import React, { useState } from 'react';
import {FaSave} from "react-icons/fa";
import {FiEdit, FiX } from "react-icons/fi";
import styles from "./EditableItem.module.css"

const EditableItem = ({ store, defaultValue = "", saveHandler }) => {
    const [isEdit, setEdit] = useState(false)
    const [value, setValue] = useState(defaultValue)

    const handleChange = (e) => {
        setValue(e.target.innerText)
        console.log(e.target.innerText)
    }

    const onSave = () => {
        saveHandler(value)
        setEdit(false)
    }

    return(
         isEdit ? (
             <>
                <span
                    contentEditable={true}
                    onBlur={handleChange}
                    className={styles.valueInput}>{value}</span>
                 <div className={styles.buttonsContainer}>
                     <div onClick={() => setEdit(false)} className={styles.editButton}><FiX/></div>
                     <div onClick={onSave} className={styles.editButton}><FaSave/></div>
                 </div>
             </>) : (<>
             <div className={styles.buttonsContainer}>
                 {value}
                <div onClick={() => setEdit(true)} className={styles.editButton}><FiEdit /></div>
             </div>
         </>)
    )
}

export default EditableItem;