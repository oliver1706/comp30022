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

export default class FieldPopUp extends Component {
  // Pass the fields in as the allFields tag
  constructor(props) {
    super(props);
    this.state = {
      selectedField: props.defaultField,
      rSelected: null,
      setRSelected: null,
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
            */


  render() {
    
    const rSelected = this.state.rSelected;
    const { toggle, onSave } = this.props;
    const field = this.state.selectedField;
    console.log('selected field = ' + this.state.selectedField);

    console.log('Button pressed =' + JSON.stringify(this.state.rSelected));
    return (
      <Modal className = {styles.popup} isOpen={true} toggle={toggle}>
        <ModalHeader className = {styles.header} toggle={toggle}>Sort By</ModalHeader>
        <ModalBody>
          <Form>

            <div className = {styles.page}>

              <ul className = {styles.words1}> 
                <li><p>First Name</p></li>
                <li><p>Last Name</p></li>
                <li><p>Gender</p></li>
              </ul>

            <ul className = {styles.radioButtons}>
              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'first_name'})} 
              active={this.rSelected === 'first_name'}> </Button></li>
              
              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'last_name'})} 
              active={this.rSelected === 'last_name'}> </Button> </li>

              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'gender'})} 
              active={this.rSelected === 'gender'}></Button></li>

            </ul>

            <ul className = {styles.words2}> 
                <li><p>Tag</p></li>
                <li><p>Email</p></li>
                <li><p>Phone</p></li>
              </ul>


            <ul className = {styles.radioButtons}>
              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'tag'})} 
              active={this.rSelected === 'tag'}></Button></li>

              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'email'})} 
              active={this.rSelected === 'email'}></Button></li>

              <li><Button className = {styles.sortButton} onClick={() => this.setState({rSelected: 'phone'})} 
              active={this.rSelected === 'phone'}> </Button></li>

            </ul>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className = {styles.saveButton}
            onClick={() => onSave(this.state.rSelected)}
            >
              Save
            </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

