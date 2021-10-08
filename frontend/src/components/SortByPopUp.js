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
  constructor(props) {
    super(props);
    this.state = {
        allFields = props.searchFields,
        selectedField = props.selectedField,
    };
  }

  handleChange = (e) => {
    console.log(e);
    //let { name, value } = e.target;
    
    //const newField = { ...this.state.activeItem, [name]: value };

    //this.setState({ activeItem });
  };

  fieldSelection = () => {
    const fields = this.state.allFields;

    return fields.map((field) => (
      <option value={field}>{field}</option>
    ))
  }

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Sort By</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="searchFields">Search Fields</Label>
              <select 
                name = "selectedField"
                value={this.state.selectedField}
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
            onClick={() => onSave(this.state.activeItem)}
            >
              Save
            </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

