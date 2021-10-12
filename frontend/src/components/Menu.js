import React, { Component } from "react";
import "../css/Menu.css";
import axios from 'axios';

 
class Menu extends Component {
    logout() {
        // not sure if this does anything 
        axios.post(process.env.REACT_APP_BACKEND_URL + `/app/accounts/logout/`)
        
        .then(() =>  {
          sessionStorage.removeItem("key");
          window.location.reload(false)})    
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
        <li><a href="#">View Profile</a></li>
        <li><a href="#">Manage Users</a></li>
        </ul>
      </div>
    );
  }
}
 
export default Menu;