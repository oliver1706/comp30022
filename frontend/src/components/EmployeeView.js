
import EmployeeModal from './EmployeeModal.js';
import NewEmployee from './NewEmployee.js';
import FieldPopUp from '../components/FieldPopUp.js';
import '../App.css';
import React, { Component, Redirect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
import logo from "../images/logo.jpg";
import styles from '../css/home.module.css';
import manage_styles from '../css/manage.module.css';
import Menu from'./Menu.js';

import CustomerModal from './CustomerModal.js';
import Home from './Home.js';

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
      visible: false, 
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
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

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

    this.setState({ activeItem: item, newEmployee: !this.state.newEmployee, disableEdit: false });
  };

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        className = {styles.customer}
        onClick={()=> this.editItem(item)}
      >
        <span className = {styles.name}> {item.first_name} {item.last_name} </span>
        <br/>
        <span className = {styles.secondaryText}>{item.phone} {item.department} </span>
        </li>
    ));
  };

  // menu logic 

  handleMouseDown(e) {
    console.log('Menu button clicked');
    this.toggleMenu();
 
    console.log("clicked");
    e.stopPropagation();
  }
   
  toggleMenu() {
    this.setState({
        visible: !this.state.visible
    });
  }
 
toggleMenu() {
  this.setState({
      visible: !this.state.visible
  });
}


  render() {
    return (
      <section id = 'HomeScreen' className = {styles.homeScreen}>
        <div id = 'main'>
  
        <div id = 'dashboard' className = {styles.dashboard}>
          <div id = 'Leftside' className = {styles.block}> 
            <div id = 'logo' className = {styles.logo}> 
              <img src = {logo} alt = "logo" className = {styles.smallLogo}/> 
            </div>
          </div>
          <a href = '/'> <button  className = {manage_styles.homebutton}> <FaHome/>  </button> </a>

          <div id = 'Rightside' className = {styles.block}>
          <a href = '/'> <button  className = {manage_styles.homebutton}> <FaHome/>  </button> </a>
            <div id = 'icons' className = {manage_styles.icons}> 
            <button onClick = {this.createItem} className = {manage_styles.dashButton}> <FaPlus/>  </button>
            
            <button onClick = {this.handleMouseDown} className = {manage_styles.dashButton}> <FaBars/>  </button>
            </div>
          </div>
        </div>
        <div id = 'Search and Filter' className = {styles.search}>
          <button className = {styles.button}> <FaFilter/>  </button>
          <Form onSubmit={e => { e.preventDefault();}}>
            <FormGroup>
              <Input className = {styles.inputBox}  type='text' name='search' value={this.state.search}
                      onChange={this.handleChange}
                      placeholder='Search'
                    />
                  </FormGroup>
                </Form>
  
        </div>
  
        <div id = 'Heading' className = {styles.heading}>
          <button onClick = {this.toggleSortBy} className = {styles.button}> <FaSortAmountUp/>  </button>
          <h3 className = {manage_styles.header}>Manage Users</h3>
        </div>
        </div>
  
        <Menu handleMouseDown={this.handleMouseDown}
            menuVisibility={this.state.visible}/>
  
        <div id = 'employees'>
        <ul className = {styles.customerList}>
                  {this.renderItems()}
                </ul>
        </div>
  
        
  {this.state.modal ? (
            <EmployeeModal
              activeItem = {this.state.activeItem}
              toggle = {this.toggle}
              onSave = {this.handleSubmit}
              />
          ) : null}

{this.state.newEmployee ? (
            <NewEmployee
              activeItem = {this.state.activeItem}
              toggle = {this.toggleNewEmployee}
              onSave = {this.addEmployee}
              />
          ) : null}
          {this.state.searchToggle ? (
            <FieldPopUp
            allFields = {['', 'first_name', 'last_name', 'gender', 'tag', 'email', 'phone']}
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
            className = {styles.sortPopup}
            />
          ) : null}
  
  
      </section>
  
    );
    }
}
  /*
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
*/

