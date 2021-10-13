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
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/departments/`)
    .then((res) => this.setState({departments: res.data.results}))
    .catch((err) => console.log(err));

    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/organisations/`)
    .then((res) => this.setState({organisations: res.data.results}))
    .catch((err) => console.log(err));
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    if (value == '') {
      value = null;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  organisationSelection = () => {
    const allOrganisations = this.state.departments;
    
    return allOrganisations.map((organisation) => (
      <option value={organisation.id}>{organisation.name.name}</option>
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
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add New Customer</ModalHeader>
        <button 
          className = 'btn btn-primary'
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
                onChange={this.handleChange}
                placeholder="Enter Customer Description"
              />
            </FormGroup>
            <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  disabled={this.state.disableEdit}
                  type="text"
                  name="first_name"
                  value={this.state.activeItem.first_name}
                  onChange={this.handleChange}
                  placeholder="Enter Customer/Rep First Name"
                />
              </FormGroup>
              <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="last_name"
                    value={this.state.activeItem.last_name}
                    onChange={this.handleChange}
                    placeholder="Enter Customer/Rep Last Name"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="job_title">Job Title</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="job_title"
                    value={this.state.activeItem.job_title}
                    onChange={this.handleChange}
                    placeholder="Blank if Not Applicable"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="email"
                    value={this.state.activeItem.email}
                    onChange={this.handleChange}
                    placeholder="john@example.com"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="phone">Phone No.</Label>
                  <Input
                    disabled={this.state.disableEdit}
                    type="text"
                    name="phone"
                    value={this.state.activeItem.phone}
                    onChange={this.handleChange}
                    placeholder="0410123456"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="department">Department</Label>
                  <select 
                    disabled={this.state.disableEdit}
                    name = "department"
                    value={this.state.activeItem.department}
                    onChange={this.handleChange}
                    placeholder="Select a Department">
                    {this.departmentSelection()}
                </select>
              </FormGroup>
              <FormGroup>
                  <Label for="organisation">Organisation</Label>
                  <select 
                    disabled={this.state.disableEdit}
                    name = "organisation"
                    value={this.state.activeItem.organisation}
                    onChange={this.handleChange}
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
                    onChange={this.handleChange}
                    placeholder="Eg; #construction"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="gender">Gender</Label>
                  <select onChange={this.handleChange}
                          disabled={this.state.disableEdit}
                          value={this.state.activeItem.gender}>
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

