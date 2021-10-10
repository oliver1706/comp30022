import React, { Redirect, Component } from 'react';
import styles from '../css/home.module.css';
import logo from "../images/logo.jpg";
import Menu from'./Menu.js';

import {FaHome, FaPlus, FaBars,FaSearch, FaFilter,FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import useToken from '../useToken';
import CustomerView from './CustomerView.js';

import CustomerModal from '../components/CustomerModal.js';
import FieldPopUp from './FieldPopUp';

import {Form, FormGroup, Input} from 'reactstrap';




export default class Home extends Component {

  /*
  constructor(props, context) {
    super();
   
    this.state = {
      visible: false
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  */

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      viewAll: true,
      selection: 'customers',
      dataList: [],
      modal: false,
      searchToggle: false,
      sortToggle: false,
      searchOn: '',
      sortBy: '',
      search: '',
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
    this.handleChange.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  };

  
  goHome() {
    window.location.reload(false);
  }

  // customer functionality 

  componentDidMount() {
    console.log(`Search is: ${this.state.search}`);
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

  

  handleSubmit = (item) => {

    console.log(item)
    this.toggle();

    if (item.id) {
      console.log('Item submitted');
      axios
        .patch(`/app/${this.state.selection}/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post(`/app/${this.state.selection}/`, item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    
    axios
      .delete(`/app/${this.state.selection}/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    console.log('Yo gaba gaba')
    const item = {
                first_name : "",
                last_name : "",
                email : "",
                job_title : "",
                phone : "",
                department : "",
                organisation : null,
                tag : "",
                gender : null
              };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayAll = (status) => {
    if (status) {
      return this.setState({ viewAll: true });
    } else {
      return this.setState({ viewAll: false});
    }
  }

  handleChange = (e) => {
    const target = e.target;
    this.setState({ search: target.value }, () => {this.refreshList()});
    console.log(`Goopity Moop ${target.value} vs ${this.state.search}`);
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
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
    <section id = 'HomeScreen'>
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
            <Input className = {styles.input}  type='text' name='search' value={this.state.search}
                    onChange={this.handleChange}
                    placeholder='Search'
                  />
                </FormGroup>
              </Form>

      </div>

      <div id = 'Heading' className = {styles.heading}>
        <button onClick = {this.toggleSortBy} className = {styles.button}> <FaSortAmountUp/>  </button>
        <h3 className = {styles.header}>Current Customers</h3>
      </div>

      </div>

      <Menu handleMouseDown={this.handleMouseDown}
          menuVisibility={this.state.visible}/>

      <div id = 'customers'>
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