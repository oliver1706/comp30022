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

export default class CustomerModal extends Component {
  // Pass the fields in as the allFields tag
  constructor(props) {
    super(props);
    this.state = {
      selectedField: props.defaultField
    };
  }

  handleChange = (e) => {
    console.log(e);
    const { value } = e.target;

    this.setState({selectedField: value})
  };

  fieldSelection = () => {
    const fields = this.props.allFields;

    return fields.map((field) => (
      <option value={field}>{field}</option>
    ))
  }

  render() {
    const { toggle, onSave } = this.props;
    const field = this.state.selectedField;
    console.log(this.state.selectedField);
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Sort By</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="searchFields">Search Fields</Label>
              <select 
                name = "selectedField"
                value={field}
                onChange={this.handleChange}
                placeholder="Search by...">
                  {this.fieldSelection()}
                </select>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(field)}
            >
              Save
            </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

