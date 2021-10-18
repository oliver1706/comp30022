import React, { Component } from "react";
import "../css/Menu.css";
import axios from 'axios';
import AbstractView from "./AbstractView";

import exportFromJSON from 'export-from-json';
import getAuthheader from '../Authentication.js';

 
class Menu extends AbstractView {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state
    };

    this.exportData = this.exportData.bind(this);
    this.requestExport = this.requestExport.bind(this);
  }

    logout() {
        // not sure if this does anything 
        axios.post(process.env.REACT_APP_BACKEND_URL + `/app/accounts/logout/`)
        
        .then(() =>  {
          sessionStorage.removeItem("key");
          window.location.reload(false)})    
      }

      requestExport() {
        const fileName = 'customers'
        const exportType = exportFromJSON.types.json
        let data = [];
        console.log("trying");
        axios
            .get(process.env.REACT_APP_BACKEND_URL + `/app/customers/export_data/`, getAuthheader())
            .then((res) => this.setState({exportData: res.data}, () => this.exportData()))
            .catch((err) => console.log(err));
      }

      exportData(){
        const data = this.state.exportData;
        console.log(data);
        const fileName = 'customers'
        const exportType = exportFromJSON.types.json
        exportFromJSON({data, fileName, exportType})
      }

  render() {
    var visibility = "hide";
 
    if (this.props.menuVisibility) {
      visibility = "show";
    }
 
    return (
      <div id="flyoutMenu"
           onMouseDown={this.props.handleMouseDown} 
           className={visibility}>
        <ul>
        <li><a href="#">Close</a></li>
        <li><a href="#" onClick = {() => this.logout()} >Logout</a></li>
        <li><a href="#" onClick = {() => this.requestExport()} >Export Customer Data</a></li>
        <li><a href="/employees">Manage Users</a></li>
        </ul>
      </div>
    );
  }
}
 
export default Menu;