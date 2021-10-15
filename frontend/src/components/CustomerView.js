
import CustomerModal from '../components/CustomerModal.js'
import '../App.css';
import FieldPopUp from './FieldPopUp';
import AdvancedSearch from'./AdvancedSearch.js'
import React, { Component } from 'react';
import axios from 'axios';
import AbstractView from './AbstractView.js';
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
import getAuthheader from '../Authentication.js';

export default class CustomerView extends AbstractView {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      selection: "customers",
      activeItem: {
        first_name : "",
        last_name : "",
        email : "",
        job_title : "",
        phone : "",
        department : "",
        organisation : "",
        tag : "",
        gender : null
      },

    };

  };

  createItem = () => {
    const item = {
                /*first_name : "",
                last_name : "",
                email : "",
                job_title : "",
                phone : "",
                department : "",
                organisation : null,
                tag : "",
                gender : null*/
              };

    this.setState({ activeItem: item, modal: !this.state.modal, disableEdit: false });
  };

  testSubmit(photo) {

    const testItem = {
        first_name: "Nigel",
        last_name: "Miguel",
        job_title: "Fishermaan",
        phone: "20322321314"
      }

    var testForm = new FormData()

    for (var key in testItem) {
      console.log(key);
      console.log(testItem[key]);
      testForm.append(key, testItem[key]);
      console.log(testForm);
    }
    testForm.append('test', 'jest');

    console.log(testForm.get('test'));
    console.log("hii");
    testForm.append('photo', photo);
    axios.post("http://localhost:8000/app/customers/", testForm, getAuthheader()).then((res) => console.log(res));

    axios.get("http://localhost:8000/app/customers/140", getAuthheader()).then((res) => console.log(res));

  }

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        key = {item.id}
        className = 'list-group-item d-flex justify-content-between align-items-center'
      >
        <span
          className = 'Customers'
        >{item.id}: {item.organisation} {item.first_name} {item.last_name}  {item.phone}  {item.department}
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

        <h1 className= 'text-white text-uppercase text-center my-4'>Customer app</h1>
        <input
          type="file"
          onChange={(e) => this.testSubmit(e.target.files[0]) }
          />
        <div className = 'row'>
          <div className = 'col-md-20 col-sm-10 mx-auto p-0'>
            <div className = 'card p-3'>
              <div className = 'mb-4'>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.createItem}
                >
                  Add Customer
                </button>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.toggleAdvancedSearch}
                >
                  Advanced Search
                </button>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.toggleSortBy}
                >
                  Sort By
                </button>
                {this.state.next ? (
                  (<button
                    className = 'btn btn-primary'
                    onClick = {this.nextPage}>
                      Next Page
                  </button>)
                  ) : null}
                {this.state.previous ? (
                  <button
                    className = 'btn btn-primary'
                    onClick = {this.prevPage}>
                      Prev Page
                  </button>
                  ) : null}
              </div>
              <Form onSubmit={e => { e.preventDefault();}}>
                <FormGroup>
                  
                  <Input
                    type='text'
                    name='search'
                    value={this.state.search}
                    onChange={this.updateSearchBar}
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
        
        {this.state.modal ? (
          <CustomerModal
            disableEdit = {this.state.disableEdit}
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
        {this.state.searchToggle ? (
          <FieldPopUp
          allFields = {['search', 'first_name', 'last_name', 'gender', 'tag', 'email', 'phone']}
          defaultField = {this.state.searchOn}
          toggle = {this.toggleSearchBy}
          onSave = {this.updateSearch}
          />
        ) : null}
        {this.state.sortToggle ? (
          <FieldPopUp
          allFields = {['', 'first_name', 'last_name', 'gender', 'tag', 'email', 'phone']}
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