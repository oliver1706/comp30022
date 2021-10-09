
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

export default class EmployeeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      selection: 'employees',
      dataList: [],
      modal: false,
      search: '',
      searchToggle: false,
      sortToggle: false,
      searchOn: 'search', //Default, searches all searchable fields
      sortBy: '',

      pageNum: 1,
      next: null,
      previous: null,
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

  };

  componentDidMount() {
    this.refreshList();
  };

  refreshList = () => {

    console.log(`Search is: ${this.state.search}`);
    console.log(`Searching on: ${this.state.searchOn}`);
    console.log(`Sort is: ${this.state.sortBy}`);
    console.log(`Asking for page ${this.state.pageNum}`);

    axios
      .get(`/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}&${this.state.sortBy}`)
      .then((res) => this.setState({dataList: res.data.results,
                                    next: res.data.next,
                                    previous: res.data.previous}), () =>{console.log(`/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}${this.state.sortBy}`)})
      .catch((err) => console.log(err));

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
    const sortString = `ordering=${e}`;
    console.log(`sortString is: ${sortString}`)
    this.toggleSortBy();
    this.setState({sortBy: sortString}, () => this.refreshList());
  }

  handleChange = (e) => {
    const target = e.target;
    this.setState({ search: target.value }, () => {this.refreshList()});
    console.log(`Desired ${target.value} vs Current ${this.state.search}`);
  };

  nextPage = () => {
    const currPage = this.state.pageNum;
    if(this.state.next){
      this.setState({pageNum: currPage + 1}, this.refreshList());
    }
  }

  prevPage = () => {
    const currPage = this.state.pageNum;
    if(this.state.previous) {
      this.setState({pageNum: currPage - 1}, this.refreshList());
    }
  }

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
      </main>
    )
  };
}

