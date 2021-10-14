import axios from "axios";
import React, { Component } from "react";
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
import getAuthheader from "../Authentication";

export default class CustomerInvoices extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      allInvoices: [],
      currInvoice: null,
      invoiceNum: 0,
    };

    this.incrementInvoiceNum = this.incrementInvoiceNum.bind(this);
  }

  componentDidMount() {
    this.refreshInvoices();
    
  }
  refreshInvoices = () => {
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}}`, getAuthheader())
    .then((res) => this.setState({customer: res.data}))
    .catch((err) => console.log(err));
    
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}/`, getAuthheader())
    .then((res) => console.log(res.data));

    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}/invoices`, getAuthheader())
    .then((res) => this.setState(
        {
            allInvoices: res.data,
            currInvoice: (res.data)[0],
        }
    ))
    .catch((err) => console.log(err));
  }

  invoiceSelection = () => {
      const invoiceList = this.state.allInvoices;

      return invoiceList.map((invoice) => (
          <option value={invoice.id}>{invoice.description}</option>
      ));
  }

  incrementInvoiceNum(i){
    const currNum = this.state.invoiceNum;
    const invoices = this.state.allInvoices;
    switch(i){
        case -1:
            if(currNum >= 1) {
                const newNum = currNum - 1;
                this.setState({invoiceNum: newNum});
                this.setState({currInvoice: invoices[newNum]});
            } else {
                const newNum = currNum
                this.setState({invoiceNum: newNum});
                this.setState({currInvoice: invoices[newNum]});
            }
        case 1:
            if(currNum < this.state.allInvoices.length - 1) {
                const newNum  = currNum + 1;
                this.setState({invoiceNum: newNum});
                this.setState({currInvoice: invoices[newNum]});
            } else {
                const newNum = currNum;
                this.setState({invoiceNum: newNum});
                this.setState({currInvoice: invoices[newNum]});
            }       
    }
  }

  setInvoice = (e) => {
      const invoiceList = this.state.allInvoices;
      const { name, value } = e.target;

      const matchInvoice = (elem) => elem.id == value;

      const newIndex = invoiceList.findIndex(matchInvoice);
      const newInvoice = invoiceList[newIndex];

      this.setState({
            currInvoice: newInvoice,
            invoiceNum: newIndex,

        }
    )
  }

  renderCurrentInvoice() {
      const invoice = this.state.currInvoice;
      if(this.state.currInvoice != null){
        return (
            <main className = 'container'>
            <h1 className= 'text-black text-center my-4'>{invoice.description}</h1>
            <div className = 'row'>
            <div className = 'col-md-20 col-sm-10 mx-auto p-0'>
                <div className = 'card p-3'>
                    <div className = 'mb-4'>
                        Total Paid: {invoice.total_paid}
                    </div>
                    <div className = 'mb-4'>
                        Total Due: {invoice.total_due}
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
  render() {
      const invoice = this.currInvoice;
      return (<main className = 'container'>
          {this.renderCurrentInvoice()}
          <button 
            className = 'btn btn-primary'
            onClick={() => this.incrementInvoiceNum(1)}
          >
            next
          </button>
          <button 
            className = 'btn btn-primary'
            onClick={() => this.incrementInvoiceNum(-1)}
          >
            previous
          </button>
          <Form>
              <FormGroup>
                <Label for="currInvoice"> The jester jests, the bester bests </Label>
                <select 
                    name = "currInvoice"
                    onChange={this.setInvoice}
                    value={invoice}
                    placeholder="Select an Invoice">
                    {this.invoiceSelection()}
                </select>
          </FormGroup>
          </Form>
          </main>
      );
    }
}
