import React from 'react';
import styles from '../css/home.module.css';
import logo from "../images/logo.jpg";

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';


export default function Home() {

  return (
    <section id = 'HomeScreen'>
      <div id = 'dashboard' className = {styles.dashboard}>
        <div id = 'Leftside' className = {styles.block}> 
          <div id = 'logo' className = {styles.logo}> 
            <img src = {logo} alt = "logo" className = {styles.smallLogo}/> 
          </div>
        </div>

        <div id = 'Rightside' className = {styles.block}>
          <div id = 'icons' className = {styles.icons}> 
          <button className = {styles.dashButton}> <FaPlus/>  </button>
          <button className = {styles.dashButton}> <FaHome/>  </button>
          <button className = {styles.dashButton}> <FaBars/>  </button>
          </div>
        </div>
      </div>
      <div id = 'Search and Filter' className = {styles.search}>
        <button className = {styles.button}> <FaFilter/>  </button>
        <input class = 'fas fa-search'  type = 'text' placeholder = "&#xf002; Search"/> 

      </div>

      <div id = 'Heading' className = {styles.heading}>
        <button className = {styles.button}> <FaSortAmountUp/>  </button>
        <h3 className = {styles.header}>Current Customers</h3>
      </div>


    </section>

  );
}