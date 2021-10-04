import React from 'react';
import styles from '../css/home.module.css';
import logo from "../images/logo.jpg";


export default function Home() {

  return (
    <div className = {styles.row}>
      <div className = {styles.block}> 
        <img src = {logo} alt = "logo" className = {styles.smallLogo}/>
      </div>
      <div className = {styles.block}>Hi</div>

      <div className = {styles.block}>Bye</div>

    </div>

  );
}