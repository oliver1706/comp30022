import styles from "../../css/home.module.css"
import logo from  "../../images/logo.jpg"
import React, {useState, useEffect} from 'react';
import {HomeButton, MenuButton, AddItemButton} from './HeaderButtons.js';

export function Header(props) {

    return (
        <div id = 'dashboard' className={styles.dashboard}>
            <div id = "Leftside" className={styles.block}>
                <div id = 'logo' className={styles.logo}>
                    <img src = {logo} alt = "logo" className={styles.smallLogo}/>
                </div>
            </div>
            <div id = 'Rightside' className = {styles.block}>
                <div id = 'icons' className = {styles.icons}>
                    <HomeButton goHome={props.goHome}/>
                    <MenuButton openMenu={props.openMenu}/>
                    <AddItemButton addItem={props.addItem}/>
                </div>
            </div>
        </div>
    );
}