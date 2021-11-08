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
import { FaAudioDescription } from 'react-icons/fa';
import axios from 'axios'
import styles from '../../css/viewCustomer.module.css';
import alternateStyles from '../../css/infotabs.module.css'
import { getAuthheader } from '../main/Util';
import { CustomerView } from './CustomerView';

import React, { useState, useEffect } from 'react'
import { EditCustomer } from './EditCustomer';
import { CustomerGraphs } from './CustomerGraphs'
import { CustomerInvoices } from "./CustomerInvoices";

export function InspectCustomer(props) {

    const [activeTab, setActiveTab] = useState("edit");
    const [editable, setEditable] = useState(props.editable)
    const renderHeader = () => {
        return(
        <div>
        <header className={styles.header}>{props.customer.first_name} {props.customer.last_name}
            <Button
                color="success"
                onClick={() => props.handleClose()}
                className = {styles.saveButton}
            >Close
            </Button>
            <button className={alternateStyles.profileButton} onClick={() => requestWatch(props.customer.id)}> Watch </button>
            <button className={alternateStyles.profileButton} onClick={() => requestUnwatch(props.customer.id)}> Unwatch </button>
            
            <button className={alternateStyles.profileButton} onClick={() => setActiveTab('edit')}> view </button>
            { props.customer.invoices.length ?
                <div>
                    <button className={alternateStyles.profileButton} onClick={() => setActiveTab('graphs')}> graphs </button>
                    <button className={alternateStyles.profileButton} onClick={() => setActiveTab('invoices')}> invoices </button>
                </div>
                :
                null
            }
            </header>
        </div>
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
    console.log("Hello")
    axios
        .post(process.env.REACT_APP_BACKEND_URL + `app/customers/${id}/watch`, id, getAuthheader())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
}

function requestUnwatch(id) {

    axios
        .post(process.env.REACT_APP_BACKEND_URL + `app/customers/${id}/unwatch`, id, getAuthheader())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
}