import React from 'react';
import styles from '../css/home.module.css';
import sidebar from '../css/sidebar.module.css'
import logo from "../images/logo.jpg";

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';


export function getCustomers() {
  return  fetch(`app/customers/`)
  .then (data=> data.json)
} 

/*
async function logout() {
  axios.post(`app/accounts/logout/`);
  sessionStorage.removeItem("key");
  window.location.reload(false);
}

*/

export default function Home() {
  console.log(getCustomers());
  return (
    <section id = 'HomeScreen'>
      <div id = 'main'>

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
          <button className = {styles.dashButton} onClick = {openNav}> <FaBars/>  </button>
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

      </div>

      <div id="mySidebar" className = {sidebar}>
        <a href="javascript:void(0)" class="closebtn" onClick= {closeNav}>Close</a>
        <a>Logout</a>
        <a href="#">View Profile</a>
      </div>

      


    </section>

  );
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "350px";
  document.getElementById("main").style.marginRight = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}