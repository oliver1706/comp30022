import React, { Component } from "react";
import "../css/Menu.css";
import axios from 'axios';

 
class Menu extends Component {
    logout() {
        // not sure if this does anything 
        axios.post(`app/accounts/logout/`);
        
        sessionStorage.removeItem("key");    
        window.location.reload(false);
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
        <h2><a href="#">Close</a></h2>
        <h2><a href="#" onClick = {() => this.logout()} >Logout</a></h2>
        <h2><a href="#">View Profile</a></h2>
        <h2><a href="#">Manage Users</a></h2>
      </div>
    );
  }
}
 
export default Menu;