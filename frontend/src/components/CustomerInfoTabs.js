import axios from "axios";
import React, { Component } from "react";
import getAuthheader from "../Authentication.js";
import styles from '../css/infotabs.module.css';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

// Provides 3 buttons to tab between Main customer view, customer stats, and customer plots.
export default class CustomerStatistics extends Component {
    constructor(props) {
      
      super(props);
      this.state = {
      };
  
    }
  
    componentDidMount() {
        console.log("greeee")
    }
  
    render() {
      const activeView = this.props.activeView;
      const onTab = this.props.onTab;
        return (
          <div>
            <button 
                className = {styles.profileButton}
                disables={this.props.activeView === "main"}
                value="main"
                onClick={() => onTab("main")}
            >
            Profile
            </button>
            {this.props.customer.invoices.length ? (<div className = {styles.infotabs}><button 
                  className = {styles.otherButtons}
                  disables={this.props.activeView === "invoices"}
                value="invoices"
                onClick={() => onTab("invoices")}
            >
            Invoices
            </button>
            <button
                className = {styles.otherButtons}
                disables={this.props.activeView === "plots"}
                value="plots"
                onClick={() => onTab("plots")}
            >
            Plots
            </button></div>) : null}
          </div>
        )
    }
}