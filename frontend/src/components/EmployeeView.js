
import EmployeeModal from './EmployeeModal.js';
import FieldPopUp from '../components/FieldPopUp.js';
import '../App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { 
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label, 
} from 'reactstrap';
import AbstractView from './AbstractView.js';
import AdvancedSearch from './AdvancedSearch.js';

export default class EmployeeView extends AbstractView {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      selection: 'employees',
      activeItem: {
        id: '', 
        job_title: '',
        phone: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        department: ''
      },

    };

  };

  createItem = () => {
    const item = {
                id: '', 
                job_title: '',
                phone: '',
                username: '',
                first_name: '',
                last_name: '',
                email: 'company@company.com',
                password: 'default',
                department: ''
              };

    this.setState({ activeItem: item, modal: !this.state.modal, disableEdit: false });
  };

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        key = {item.id}
        className = 'list-group-item d-flex justify-content-between align-items-center'
      >
        <span
          className = 'Employees'
        >{item.id}: {item.first_name} {item.last_name} {item.job_title}  {item.phone}  {item.department}
        </span>
        <span>
          <button
            className = 'btn btn-secondary mr-2'
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className='btn btn-danger'
            onClick = {() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    
    return (
      <main className = 'container'>
        <h1 className= 'text-white text-uppercase text-center my-4'>Employee app</h1>
        <div className = 'row'>
          <div className = 'col-md-30 col-sm-10 mx-auto p-0'>
            <div className = 'card p-3'>
              <div className = 'mb-4'>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.createItem}
                >
                  Add employee
                </button>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.toggleAdvancedSearch}
                >
                  Advanced Search
                </button>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.toggleSearchBy}
                >
                  Search On
                </button>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.toggleSortBy}
                >
                  Sort By
                </button>
              </div>
              <Form onSubmit={e => { e.preventDefault();}}>
                <FormGroup>
                  
                  <Input
                    type='text'
                    name='search'
                    value={this.state.search}
                    onChange={this.handleChange}
                    
                    placeholder='Search'
                  />
                </FormGroup>
              </Form>
              <ul className = 'list-group list-group-flush border-top-0'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.next ? (
          (<button
            className = 'btn btn-primary'
            onClick = {this.nextPage()}>
              Next Page
          </button>)
        ) : null}
        {this.state.previous ? (
          <button
            className = 'btn btn-primary'
            onClick = {this.prevPage()}>
              Prev Page
          </button>
        ) : null}
        
        {this.state.modal ? (
          <EmployeeModal
            disableEdit = {this.state.disableEdit}
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
        {this.state.searchToggle ? (
          <FieldPopUp
          allFields = {['search', 'phone']}
          defaultField = {this.state.searchOn}
          toggle = {this.toggleSearchBy}
          onSave = {this.updateSearch}
          />
        ) : null}
        {this.state.sortToggle ? (
          <FieldPopUp
          allFields = {['', 'phone']}
          toggle = {this.toggleSortBy}
          onSave = {this.updateSort}
          />
        ) : null}
        {this.state.advancedSearchToggle ? (
          <AdvancedSearch
          allFields ={['first_name', 'last_name', 'gender', 'tag', 'email', 'phone']}
          toggle = {this.toggleAdvancedSearch}
          onSave = {this.updateAdvancedSearch}
          />
        ) : null}
      </main>
    )
  };
}

