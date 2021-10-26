import axios from "axios"
import React, { useState, useEffect } from "react";
import styles from '../../css/viewCustomer.module.css'

import {
    Form,
    FormGroup,
    Label,
} from "reactstrap"
import { getAuthheader } from "../main/Util.js"

export function CustomerInvoices(props) {

    const [allInvoices, setAllInvoices] = useState([]);
    const [currInvoice, setCurrInvoice] = useState(null);
    const [invoiceNum, setInvoiceNum] = useState(0);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${props.customer.id}/invoices`, getAuthheader())
            .then((res) => {setAllInvoices(res.data); setCurrInvoice(res.data[0])})
            .catch((err) => console.log(err));
    }, [])

    const invoiceSelection = () => {
        const invoiceList = allInvoices;
  
        return invoiceList.map((invoice) => (
            <option value={invoice.id}>{invoice.description}</option>
        ));
    }

    const incrementInvoiceNum = (i) => {
        const currNum = invoiceNum;
        const invoices = allInvoices;
        switch(i){
            case -1:
                if(currNum >= 1) {
                    const newNum = currNum - 1;
                    setInvoiceNum(newNum);
                    setCurrInvoice(invoices[newNum]);
                } else {
                    const newNum = currNum
                    setInvoiceNum(newNum);
                    setCurrInvoice(invoices[newNum]);
                }
            case 1:
                if(currNum < allInvoices.length - 1) {
                    const newNum  = currNum + 1;
                    setInvoiceNum(newNum);
                    setCurrInvoice(invoices[newNum]);
                } else {
                    const newNum = currNum;
                    setInvoiceNum(newNum);
                    setCurrInvoice(invoices[newNum]);
                }
        }
    }

    const setInvoice = (e) => {

        const { name, value } = e.target;
  
        const matchInvoice = (elem) => elem.id == value;
  
        const newIndex = allInvoices.findIndex(matchInvoice);
        const newInvoice = allInvoices[newIndex];
        
        setCurrInvoice(newInvoice);
        setInvoiceNum(newIndex);
    }

    const renderCurrentInvoice = () => {

        const invoice = currInvoice;

        if (invoice != null) {
            return (
                <main className = 'container'>
                <h1 className= 'text-black text-center my-4'>{invoice.description}</h1>
                <div className = 'row'>
                    <div className = 'col-md-20 col-sm-10 mx-auto p-0'>
                        <div className = 'card p-3'>
                            <span className = {styles.name}>
                                Total Paid: {invoice.total_paid}
                            </span>
                            <span className = {styles.name}>
                                Total Due: {invoice.total_due}
                            </span>
                            <span className = {styles.name}>
                                Due on: {invoice.due_date}
                            </span>
                        </div>
                    </div>
                </div>
                </main>
            )
        } else {
            return (<body>Loading</body>)
        }
    }

    return (
        <body>
            <Form>
                <FormGroup>
                    <Label for="currInvoice"></Label>
                    <select 
                        name = "currInvoice"
                        onChange={setInvoice}
                        value={currInvoice}
                        placeholder="Select an Invoice">
                        {invoiceSelection()}
                    </select>
                </FormGroup>
            </Form>
            {renderCurrentInvoice()}
                <div className = {styles.footButtons}>
                

                <button 
                    className = {styles.bottomButton}
                    onClick={() => incrementInvoiceNum(-1)}
                >
                previous
                </button>

                <button 
                    className = {styles.bottomButton}
                    onClick={() => incrementInvoiceNum(1)}
                >
                next
                </button>
            </div>
          </body>
      );
}