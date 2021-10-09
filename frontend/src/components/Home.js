import React, { Component } from 'react';
import styles from '../css/home.module.css';
import sidebar from '../css/sidebar.module.css'
import logo from "../images/logo.jpg";

import Menu from'./Menu.js';

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import useToken from '../useToken';


export default class Home extends Component {
  constructor(props, context) {
    super();
   
    this.state = {
      visible: false
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  handleMouseDown(e) {
    console.log('Menu button clicked');
    this.toggleMenu();
 
    console.log("clicked");
    e.stopPropagation();
  }
   
  toggleMenu() {
    this.setState({
        visible: !this.state.visible
    });
  }
 
toggleMenu() {
  this.setState({
      visible: !this.state.visible
  });
}

  render() {
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
          <button onClick = {this.handleMouseDown} className = {styles.dashButton}> <FaBars/>  </button>
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

      <Menu handleMouseDown={this.handleMouseDown}
          menuVisibility={this.state.visible}/>


    </section>

  );
  }
}