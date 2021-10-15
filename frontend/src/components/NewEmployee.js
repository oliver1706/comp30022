import axios from "axios";
import styles from '../css/addEmployee.module.css'
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

export default class NewEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      departments: [],
      disableEdit:  this.props.disableEdit,
    };
  }

  componentDidMount() {
    console.log(this.state.disableEdit);
    console.log(this.props.disableEdit);
    this.refreshData();
  };

  refreshData() {
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/departments/`, getAuthheader())
    .then((res) => this.setState({departments: res.data.results}))
    .catch((err) => console.log(err));
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  departmentSelection = () => {
    const allDepartments = this.state.departments;
    
    return allDepartments.map((department) => (
      <option value={department.id}>{department.name}</option>
    ));
  }

  /*
  enableEdit = () => {
    this.setState({disableEdit: false})
  }
  */

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader className ={styles.header} toggle={toggle}>Add New User </ModalHeader>
        <ModalBody>
          <Form className = {styles.inputForm}>
          <FormGroup>
              <Label for="user_name">Username</Label>
              <Input
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                type="text"
                name="username"
                value={this.state.activeItem.username}
                onChange={this.handleChange}
                placeholder="Enter Employee Username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="first_name">First Name</Label>
              <Input
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                type="text"
                name="first_name"
                value={this.state.activeItem.first_name}
                onChange={this.handleChange}
                placeholder="Enter Employee First Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="last_name">Last Name</Label>
              <Input
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                type="text"
                name="last_name"
                value={this.state.activeItem.last_name}
                onChange={this.handleChange}
                placeholder="Enter Employee Last Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="job_title">Job Title</Label>
              <Input
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                type="text"
                name="job_title"
                value={this.state.activeItem.job_title}
                onChange={this.handleChange}
                placeholder="Enter Employee Job Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                type="text"
                name="phone"
                value={this.state.activeItem.phone}
                onChange={this.handleChange}
                placeholder="Enter Employee Phone Number"
              />
            </FormGroup>
            <FormGroup>
              <Label for="department">Department</Label>
              
              <select 
                className = {styles.customerInput}
                disabled={this.state.disableEdit}
                name = "department"
                value={this.state.activeItem.department}
                onChange={this.handleChange}
                placeholder="Select a Department">
                {this.departmentSelection()}
              </select>
            </FormGroup>
          </Form>

          <Button
            disabled={this.state.disableEdit}
            color="success"
            onClick={() => onSave(this.state.activeItem)}
            className = {styles.saveButton}
          >
            Save
          </Button>
        </ModalBody>
        <ModalFooter>
          
        </ModalFooter>
      </Modal>
    );
  }
}

NewEmployee.defaultProps = {
    disableEdit: false
}