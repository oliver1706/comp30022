import React from 'react';
import styles from '../../css/home.module.css';
import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
//All of the  buttons used by the
export function HomeButton(props) {
    return (
        <button 
            onClick = {props.goHome} 
            className={styles.dashButton}>
                <FaHome/>
        </button>
    )
}

export function MenuButton(props) {
    return (
        <button 
            onClick = {props.openMenu} 
            className={styles.dashButton}>
                <FaBars/>
        </button>
    )
}

export function AddItemButton(props) {
    return (
        <button 
            onClick = {props.addItem} 
            className={styles.dashButton}>
                <FaPlus/>
        </button>
    
    )
}