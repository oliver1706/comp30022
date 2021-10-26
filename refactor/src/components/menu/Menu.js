

import React from "react"
import axios from "axios"
import "../../css/Menu.css";
import {getAuthheader} from '../main/Util.js'
import exportFromJSON from 'export-from-json';
export function Menu(props) {

    let visibility = "hide";
    
    if (props.visibility) {
        visibility = "show";
    }

    return (
        <div id="flyoutMenu"
            onMouseDown={props.handleMouseDown} 
            className={visibility}>
        <ul>
        <li><a onClick={() => props.handleClose()}>Close</a></li>
        <li><a onClick={() => logout()/*No need for prop*/} >Logout</a></li>
        <li><a onClick={() => requestExport()/*No need for prop*/} >Export Customer Data</a></li>
        <li><a onClick={() => {props.openEmployees(); props.handleClose()}}>View Employees</a></li>
        <li><a onClick={() => {props.openCustomers(); props.handleClose()}}>View Customers</a></li>
        </ul>
        </div>
    );

}

function logout() {
    // Not sure if this does anything 
    axios.post(process.env.REACT_APP_BACKEND_URL + `/app/accounts/logout/`)
    
    .then(() =>  {
      sessionStorage.removeItem("key");
      window.location.reload(false)})
}


// Two functions for this so it can be asynchronous (unsure if better way to do it - Max)
function requestExport() {
    let data = [];
    console.log("trying");
    axios
        .get(process.env.REACT_APP_BACKEND_URL + `/app/customers/export_data/`, getAuthheader())
        .then((res) => this.setState({exportData: res.data}, () => exportData()))
        .catch((err) => console.log(err));
  }
function exportData(){
    const data = this.state.exportData;
    console.log(data);
    const fileName = 'customers'
    const exportType = exportFromJSON.types.json
    exportFromJSON({data, fileName, exportType})
}