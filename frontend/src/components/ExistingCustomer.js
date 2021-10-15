import axios from "axios";
import React, { Component } from "react";
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
import getAuthheader from "../Authentication";

export default class ExistingCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      departments: [],
      organisations: [],
      disableEdit: this.props.disableEdit,
    };
  }

  componentDidMount() {
    this.refreshData();
  };

  refreshData() {
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/departments/`, getAuthheader())
    .then((res) => this.setState({departments: res.data.results}))
    .catch((err) => console.log(err));

    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/organisations/`, getAuthheader())
    .then((res) => this.setState({organisations: res.data.results}))
    .catch((err) => console.log(err));
  }

  handleExistingCustomer = (e) => {
    let { name, value } = e.target;
    if (value == '') {
      value = null;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  organisationSelection = () => {
    const allOrganisations = this.state.organisations;
    
    return allOrganisations.map((organisation) => (
      <option value={organisation.id}>{organisation.name}</option>
    ));
  }
  departmentSelection = () => {
    const allDepartments = this.state.departments;
    
    return allDepartments.map((department) => (
      <option value={department.id}>{department.name}</option>
    ));
  }

  enableEdit = () => {
    this.setState({disableEdit: false})
  }

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle} className = {styles.customerPopup}>
        <ModalHeader className = {styles.header} toggle={toggle}>{this.state.activeItem.first_name} &nbsp;
         {this.state.activeItem.last_name}</ModalHeader>

         <button 
          className = {styles.editButton}
          disabled = {!this.state.disableEdit}
          onClick={this.enableEdit}
        >
          Edit
        </button>
       
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                disabled={this.state.disableEdit}
                type="text"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleExistingCustomer}
                placeholder="Enter Customer Description"
                className = {styles.customerInput}
              />
            </FormGroup>
            <img src={this.state.activeItem.photo} width="250" height="400"/>
            <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  disabled={this.state.disableEdit}
                  type="text"
                  name="first_name"
                  value={this.state.activeItem.first_name}
                  onChange={this.handleExistingCustomer}
                  placeholder="Enter First Name"
                  className = {styles.customerInput}
                />
              </FormGroup>
              <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="last_name"
                    value={this.state.activeItem.last_name}
                    onChange={this.handleExistingCustomer}
                    placeholder="Enter Last Name"
                    className = {styles.customerInput}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="job_title">Job Title</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="job_title"
                    value={this.state.activeItem.job_title}
                    onChange={this.handleExistingCustomer}
                    placeholder="Blank if Not Applicable"
                    className = {styles.customerInput}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="email"
                    value={this.state.activeItem.email}
                    onChange={this.handleExistingCustomer}
                    placeholder="john@example.com"
                    className = {styles.customerInput}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="phone">Phone No.</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="phone"
                    value={this.state.activeItem.phone}
                    onChange={this.handleExistingCustomer}
                    placeholder="0410123456"
                    className = {styles.customerInput}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="department">Department</Label>
                  <br/>
                  <select 
                    disabled={this.state.disableEdit}
                    name = "department"
                    value={this.state.activeItem.department}
                    onChange={this.handleExistingCustomer}
                    placeholder="Select a Department">
                    {this.departmentSelection()}
                </select>
              </FormGroup>
              <FormGroup>
                  <Label for="organisation">Organisation</Label>
                  <br/>
                  <select 
                  className = {styles.selectButton}
                    disabled={this.state.disableEdit}
                    name = "organisation"
                    value={this.state.activeItem.organisation}
                    onChange={this.handleExistingCustomer}
                    placeholder="Select an Organisation">
                    {this.organisationSelection()}
                    
                </select>
              </FormGroup>
              <FormGroup>
                  <Label for="tag">Tags</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="Text"
                    name="tag"
                    value={this.state.activeItem.tag}
                    onChange={this.handleExistingCustomer}
                    placeholder="Eg; #construction"
                    className = {styles.customerInput}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="gender">Gender</Label>
                  <br/>
                  <select onChange={this.handleExistingCustomer}
                          disabled={this.state.disableEdit}
                          value={this.state.activeItem.gender}
                          disabled={this.state.disableEdit}>

                              
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="N">Non-Binary</option>
                      <option value=''>Not Applicable</option>
                  </select>
              </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={this.state.disableEdit}
            color="success"
            onClick={() => onSave(this.state.activeItem)}
            className = {styles.saveButton}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ExistingCustomer.defaultProps = {
    disableEdit: true
}

/* Edit button 
 <button 
          className = 'btn btn-primary'
          disabled = {!this.state.disableEdit}
          onClick={this.enableEdit}
        >
          Edit
        </button>
        */