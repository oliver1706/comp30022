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
                            editable={props.editable}
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