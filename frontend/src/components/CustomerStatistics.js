import axios from "axios";
import React, { Component } from "react";
import getAuthheader from "../Authentication.js";
import styles from '../css/viewCustomer.module.css';
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

export default class CustomerStatistics extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
        loadedPlots: false,
        loadedStats: false,
        currPlot: null,
        plots: {},
        stats: {}
    };

  }

  componentDidMount() {
      axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}/salesplot/`, getAuthheader())
      .then((res) => this.setState({plots: res.data, loadedPlots: true, currPlot: res.data.sum_of_sales_plot}))
      .catch((err) => console.log(err));
  
      axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}/stats/`, getAuthheader())
      .then((res) => this.setState({stats: res.data, loadedStats: true}))
      .catch((err) => console.log(err));

      axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${this.props.customerId}`, getAuthheader())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  updatePlot = (e) => {
    let value = e.target.value
    console.log(value);
    this.setState({currPlot: value})
  }

  plotSelection() {
    // Done manually
    const plots = this.state.plots;
    return (
      <select onChange={this.updatePlot} value={this.state.currPlot}>
        <option value={plots.sum_of_sales_plot}>Total Spending Per Month</option>
        <option value={plots.mean_of_sales_plot}>Average Spending</option>
        <option value={plots.amount_per_invoices}>Spending per Invoice</option>
      </select>
    )

  }

  render() {

    
    const onClose = this.props.onClose;
    console.log(this.state.plots)
    console.log(this.state.stats)
    if(this.state.loadedPlots) {
      return (
        <ModalBody>
          <div>
            {this.plotSelection()}
            <img src={`data:img/png;base64, ${this.state.currPlot}`} width={480} height={360}/>
          </div>
          
        </ModalBody>
      )
    }
    else {
      return (<div>Loading</div>)
    }
  }
}