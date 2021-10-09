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

export default class CustomerStatistics extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
        plot: ""
    };

  }

  componentDidMount() {
      axios.get("app/invoices/salesplot")
      .then((res) => this.setState({plot: res.data.chart}))
      .catch((err) => console.log(err));
  }

  render() {
    const chart = this.state.plot;

    return (<img src={`data:image/png;base64,${chart}`}></img>)

    }
}