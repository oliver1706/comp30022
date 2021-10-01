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
        <ModalHeader toggle={toggle}>Customer</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Customer Description"
              />
            </FormGroup>
          </Form>
          <Form>
              <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    value={this.state.activeItem.first_name}
                    onChange={this.handleChange}
                    placeholder="Enter Customer/Rep First Name"
                  />
              </FormGroup>
          </Form>
          <Form>
              <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
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
                    type="text"
                    name="phone"
                    value={this.state.activeItem.phone}
                    onChange={this.handleChange}
                    placeholder="0410123456"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="photo">photo</Label>
                  <Input
                    type="file"
                    name="photo"
                    value={this.state.activeItem.photo}
                    onChange={this.handleChange}
                    placeholder="Upload Image"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="department">Department</Label>
                  <Input
                    type="text"
                    name="Department"
                    value={this.state.activeItem.department}
                    onChange={this.handleChange}
                    placeholder="Department Blank if Not Applicable"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="organisation">Organisation</Label>
                  <Input
                    type="text"
                    name="organisation"
                    value={this.state.activeItem.organisation}
                    onChange={this.handleChange}
                    placeholder="Enter Organisation"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="tag">Tags</Label>
                  <Input
                    type="Text"
                    name="tag"
                    value={this.state.activeItem.tag}
                    onChange={this.handleChange}
                    placeholder="Eg; #construction"
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="gender">Gender</Label>
                  <select value={this.state.activeItem.gender} onChange={this.handleChange}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="N">Non-Binary</option>
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