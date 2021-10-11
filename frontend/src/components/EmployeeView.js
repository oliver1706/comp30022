
import EmployeeModal from './EmployeeModal.js';
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

export default class EmployeeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, 
      viewAll: true,
      selection: 'employees',
      dataList: [],
      modal: false,
      search: '',
      searchToggle: false,
      sortToggle: false,
      searchOn: '',
      sortBy: '',
      search: '',
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
    this.handleChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

  };

  componentDidMount() {
    this.refreshList();
  };
  
  

  refreshList = () => {

    console.log(`Search is: ${this.state.search}`);
    console.log(`Sort is: ${this.state.sortBy}`)
    if(this.state.search.length != 0) {
        if(this.state.searchOn.length != 0) {
          axios.get(`/app/${this.state.selection}/?${this.state.sortBy}${this.state.searchOn}=${this.state.search}`)
          .then((res) => this.setState({dataList: res.data.results}))
          .catch((err) => console.log(err));
        } else {
        axios.get(`/app/${this.state.selection}/?${this.state.sortBy}search=${this.state.search}`)
        .then((res) => this.setState({dataList: res.data.results}))
        .catch((err) => console.log(err));
        }
    } else {
      axios
        .get(`/app/${this.state.selection}/?${this.state.sortBy}`)
        .then((res) => this.setState({dataList: res.data.results}))
        .catch((err) => console.log(err));
    }
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {

    this.toggle();

    if (item.id) {
      console.log('Item submitted');
      axios
        .patch(`/app/employees/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post(`/app/${this.state.selection}/`, item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/app/employees/${item.id}/`)
      .then((res) => this.refreshList());
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

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  toggleSearchBy = () => {
    this.setState({ searchToggle: !this.state.searchToggle});
  }

  updateSearch = (e) => {
    console.log(e);
    this.toggleSearchBy();
    
    this.setState({searchOn: e}, this.refreshList());

  }

  toggleSortBy = () => {
    this.setState({sortToggle: !this.state.sortToggle});
  }

  updateSort = (e) => {
    console.log(e)
    const sortString = `ordering=${e}&`;
    console.log(`sortString is: ${sortString}`)
    this.toggleSortBy();
    this.setState({sortBy: sortString}, () => this.refreshList());
  }

  handleChange = (e) => {
    const target = e.target;
    this.setState({ search: target.value }, () => {this.refreshList()});
  };

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        className = {styles.customer} 
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
              <Input className = {styles.input}  type='text' name='search' value={this.state.search}
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
            <CustomerModal
              activeItem = {this.state.activeItem}
              toggle = {this.toggle}
              onSave = {this.handleSubmit}
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
        
        {this.state.modal ? (
          <EmployeeModal
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
        {this.state.searchToggle ? (
          <FieldPopUp
          allFields = {['', 'phone']}
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
      </main>
    )
  };
*/

