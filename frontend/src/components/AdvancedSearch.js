import styles from '../css/advancedSearch.module.css'
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

export default class AdvancedSearch extends Component {
  // Pass the fields in as the allFields tag
  constructor(props) {
    super(props);
    this.state = {
      searchFields: [],
    };
  }

  generateSearchString() {
    let searchString = ""
    for(let i = 0; i < this.props.allFields.length; i++) {
      if(this.state.searchFields[i]) {
        searchString = `${searchString}&${this.props.allFields[i]}=${this.state.searchFields[i]}`
      }
    }
    return searchString
  }

  componentDidMount() {
    let initialFields = []
    for(let i = 0; i < this.props.allFields.length; i++) {
      initialFields[i] = "";
    }
    this.setState({searchFields: initialFields})
    console.log("big time")
    console.log(initialFields);
  }

  handleChange = (e) => {
    console.log(e);
    console.log(e.target.name)
    console.log(e.target.value)
    const index = this.props.allFields.indexOf(e.target.name);
    const newString = e.target.value

    let newFields = this.state.searchFields
    newFields[index] = newString

    this.setState({searchFields: newFields})
    console.log(newFields);
  };

  humanise = (str) => {
    var i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  searchFields = () => {
    const fields = this.props.allFields;


    return fields.map((field) => (

        <FormGroup>
            <Label className = {styles.fieldLabel }for={field}>{this.humanise(field)}</Label>
            <Input className = {styles.customerInput}
                type="text"
                name={field}
                value={this.state.searchFields[fields.indexOf(field)]}
                onChange={this.handleChange}
                placeholder = {this.humanise(field)}
            />
        </FormGroup>
    ))
  }

  render() {
    const { toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader className = {styles.header}toggle={toggle}>Advanced Search </ModalHeader>
        <ModalBody>
          <Form>
            {this.searchFields()}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
          className = {styles.searchButton}
          color="success"
          onClick={() => onSave(this.generateSearchString())}
          
          >
            Search
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

