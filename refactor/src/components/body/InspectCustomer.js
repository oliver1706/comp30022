// Contain's and handles switching between
// the different tabs of a customer

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
    ContainerHeader,
    Form,
    FormControl,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import axios from 'axios'
import styles from '../../css/viewCustomer.module.css';
import alternateStyles from '../../css/infotabs.module.css'
import { getAuthheader } from '../main/Util';

import React, { useState, useEffect } from 'react'
import { EditCustomer } from './EditCustomer';
import { CustomerGraphs } from './CustomerGraphs'
import { CustomerInvoices } from "./CustomerInvoices";

export function InspectCustomer(props) {

    const [activeTab, setActiveTab] = useState("edit");
    const [editable, setEditable] = useState(props.editable)
    const renderHeader = () => {
        return(
        <header>
            <h2 className={styles.header}>{props.customer.first_name} {props.customer.last_name}</h2>

            <div className = {styles.tabButtons} >
                <Button
                    color="success"
                    onClick={() => props.handleClose()}
                    className = {alternateStyles.profileButton}
                >Close
                </Button>
            

                <button className={alternateStyles.profileButton} onClick={() => setActiveTab('edit')}> Profile </button>
                { props.customer.invoices.length ?
                    <div className = {alternateStyles.infotabs}>
                        <button className={alternateStyles.profileButton} onClick={() => setActiveTab('graphs')}> Graphs </button>
                        <button className={alternateStyles.profileButton} onClick={() => setActiveTab('invoices')}> Invoices </button>
                    </div>
                    :
                    null
                }
                <div className = {alternateStyles.infotabs}>
                    <button className={alternateStyles.profileButton} onClick={() => requestWatch(props.customer.id)}> Watch </button>
                    <button className={alternateStyles.profileButton} onClick={() => requestUnwatch(props.customer.id)}> Unwatch </button>
                </div>
            </div>
        </header>
        )    
    }

    const renderTab = () => {

        switch(activeTab) {

            case 'edit':
                return (
                    <div>
                        <EditCustomer
                            customer={props.customer}
                            editable={editable}
                            newCustomer={props.newCustomer}
                            handleSubmit={props.handleSubmit}
                            handleClose={props.handleClose}
                        />
                    </div>
                )
            case 'graphs':
                return (
                    <div>
                        <CustomerGraphs
                            customer={props.customer}
                        />
                    </div>
                )
            case 'invoices':
                return (
                    <div>
                        <CustomerInvoices
                            customer={props.customer}
                        />
                    </div>
                )
        }
    }

    return (
        <div>
        {renderHeader()}
        
        {renderTab()}
        </div>
    )
}

function requestWatch(id) {

    axios
    .post(process.env.REACT_APP_BACKEND_URL + `/app/customers/${id}/watch/`, id, getAuthheader());
    return null
}

function requestUnwatch(id) {

    axios
        .post(process.env.REACT_APP_BACKEND_URL + `/app/customers/${id}/unwatch/`, id, getAuthheader());
        return null
}