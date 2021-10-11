import styles from '../css/sortby.module.css';
import React, { Component, useState } from "react";
import {
  Button,
  ButtonGroup,
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
  //const [cSelected, setCSelected] = useState([]);
  //const [rSelected, setRSelected] = useState(null);

  handleChange = (e) => {
    console.log(e);
    const { value } = e.target;

    this.setState({selectedField: value})
  };

// button functionality

  fieldSelection = () => {
    const fields = this.props.allFields;

    return fields.map((field) => (
      <option value={field}>{field}</option>
    ))
  }

  /*
  onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  }
  */


  render() {
    


    const { toggle, onSave } = this.props;
    const field = this.state.selectedField;
    console.log(this.state.selectedField);
    return (
      <Modal className = {styles.popup} isOpen={true} toggle={toggle}>
        <ModalHeader className = {styles.header} toggle={toggle}>Sort By</ModalHeader>
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

            <ButtonGroup>
              <Button>Name</Button>
            </ButtonGroup>


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

