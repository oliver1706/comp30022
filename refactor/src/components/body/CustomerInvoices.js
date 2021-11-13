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
            .then((res) => {setAllInvoices(res.data); setCurrInvoice(res.data[0])});
    }, [])

    useEffect(() => {
        console.log(invoiceNum);
        console.log(currInvoice);
    }, [invoiceNum, currInvoice])

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
                break
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
                break
            default:
                console.log(`Unexpected increment i=${i}`)
        }
    }

    const setInvoice = (e) => {

        const { name, value } = e.target;
        console.log("Here")
        console.log(value);
        console.log("Here")
        const matchInvoice = (elem) => elem.id == value;
  
        const newIndex = allInvoices.findIndex(matchInvoice);
        const newInvoice = allInvoices[newIndex];
        console.log("This:")
        console.log(newInvoice)
        setCurrInvoice(newInvoice);
        setInvoiceNum(newIndex);
    }

    const renderCurrentInvoice = () => {

        const invoice = currInvoice;

        if (invoice != null) {
            return (
                <main className = 'container'>
                <h2>{`${invoice.description}`}</h2>
                <div className = 'row'>
                    <div className = 'col-md-20 col-sm-10 mx-auto p-0'>
                        <div className = 'card p-3'>
                            <div className = {styles.name}>
                                Total Paid: {invoice.total_paid}
                            </div>
                            <div className = {styles.name}>
                                Total Due: {invoice.total_due}
                            </div>
                            <div className = {styles.name}>
                                Due on: {invoice.date_due}
                            </div>
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