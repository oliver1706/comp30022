
import CustomerModal from '../components/CustomerModal.js'
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

export default class CustomerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      selection: 'customers',
      dataList: [],
      modal: false,
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

  };

  componentDidMount() {
    console.log(`Search is: ${this.state.search}`);
    this.refreshList();
  };

  refreshList = () => {
    console.log(`Search is: ${this.state.search}`);
    if(this.state.search.length != 0) {
        axios.get(`/app/${this.state.selection}/?search=${this.state.search}`)
        .then((res) => this.setState({dataList: res.data.results}))
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`/app/${this.state.selection}/`)
        .then((res) => this.setState({dataList: res.data.results}))
        .catch((err) => console.log(err));
    }
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
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
          <CustomerModal
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
      </main>
    )
  };
}