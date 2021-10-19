import React, { Redirect, Component, useState } from 'react';
import styles from '../css/home.module.css';
import logo from "../images/logo.jpg";
import Menu from'./Menu.js';

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import useToken from '../useToken';
import CustomerView from './CustomerView.js';
import getAuthheader from '../Authentication.js';
import CustomerModal from '../components/CustomerModal.js';
import FieldPopUp from './FieldPopUp';
import exportFromJSON from 'export-from-json'
import {Form, FormGroup, Input} from 'reactstrap';

import AdvancedSearch from './AdvancedSearch.js';
import AbstractView from './AbstractView';

import ExistingCustomer from './ExistingCustomer';






export default class Home extends AbstractView {

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      visible: false,
      selection: 'customers',
      activeItem: {
        first_name : "",
        last_name : "",
        email : "",
        job_title : "",
        phone : "",
        department : "",
        organisation : "",
        tag : "",
        gender : ''
      },

    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  };

  
  goHome() {
    window.location.reload(false);
    }


  createItem = () => {
    console.log('Yo gaba gaba')
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

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  importData = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader  = new FileReader()
    reader.readAsText(file);
  }

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        key={item.id}
        onClick={()=> this.editItem(item)}
        className = {styles.customer} 
      >

        <div className = {styles.parent}>
          <span className = {styles.name}> {item.first_name} {item.last_name} </span>
        </div>
        
        <span className = {styles.secondaryText}> {item.job_title} </span>
        <div>
       <img className = {styles.customerImage} src={item.photo} height={44} width={44}/>
        </div>
        
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

        <div id = 'Rightside' className = {styles.block}>
          <div id = 'icons' className = {styles.icons}> 
          <button onClick = {this.createItem} className = {styles.dashButton}> <FaPlus/>  </button>
          <button onClick = {this.goHome} className = {styles.dashButton}> <FaHome/>  </button>
          <button onClick = {this.handleMouseDown} className = {styles.dashButton}> <FaBars/>  </button>
          </div>
        </div>
      </div>
      <div id = 'Search and Filter' className = {styles.search}>
        <button className = {styles.button}> <FaFilter/>  </button>
        <Form onSubmit={e => { e.preventDefault();}}>
          <FormGroup>
            <Input className = {styles.inputBox}  type='text' name='search' value={this.state.search}
                    onChange={this.updateSearchBar}
                    placeholder='Search'
                  />
                </FormGroup>
              </Form>

      </div>

      <div id = 'Heading' className = {styles.heading}>
        <button onClick = {this.toggleSortBy} className = {styles.button}> <FaSortAmountUp/>  </button>
        
        <h3 className = {styles.header}>Current Customers</h3>

      </div>
      <h4 onClick = {this.toggleAdvancedSearch}  className = {styles.advancedSearch}>Advanced Search</h4>
      </div>

      <Menu handleMouseDown={this.handleMouseDown}
          menuVisibility={this.state.visible}/>

      <div id = 'customers'>
      <ul className = {styles.customerList}>
                {this.renderItems()}
      </ul>
        <div id = 'Footing'   className = {styles.heading}>
          {this.state.previous ? 
          (<button onClick = {() => this.prevPage()} className = {styles.button}> Previous </button>) : (null)
          }
          {this.state.next ? 
          (<button onClick = {() => this.nextPage()} className = {styles.button}> Next </button>) : (null)
          }
        </div>
      </div>
      
{this.state.modal ? (
          <CustomerModal
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}

{this.state.customer ? (
          <ExistingCustomer
            activeItem = {this.state.activeItem}
            toggle = {this.toggleExistingCustomer}
            onSave = {this.handleExistingCustomer}
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
          />
        ) : null}

        {this.state.advancedSearchToggle ? (
          <AdvancedSearch
          allFields = {['first_name', 'last_name', 'gender', 'tag', 'email', 'phone']}
          isOpen = {true}
          toggle = {this.toggleAdvancedSearch}
          onSave = {this.updateAdvancedSearch}
          />
        ) : null}


    </section>

  );
  }
}