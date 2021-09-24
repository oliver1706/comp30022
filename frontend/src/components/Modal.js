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

export default class EmployeeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Employee</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="id">Id</Label>
              <Input
                type="text"
                name="id"
                value={this.state.activeItem.id}
                onChange={this.handleChange}
                placeholder="Enter Employee Id/Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="first_name">First Name</Label>
              <Input
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
                type="text"
                name="phone"
                value={this.state.activeItem.phone}
                onChange={this.handleChange}
                placeholder="Enter Employee Phone Number"
              />
            </FormGroup>
            <FormGroup>
              <Label for="department">Department</Label>
              <Input
                type="text"
                name="department"
                value={this.state.activeItem.department}
                onChange={this.handleChange}
                placeholder="Enter Employee Department"
                />
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