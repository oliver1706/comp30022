
import CustomerModal from '../components/CustomerModal.js'
import '../App.css';
import FieldPopUp from './FieldPopUp';
import AdvancedSearch from'./AdvancedSearch.js'
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
      advancedSearch: '',
      searchToggle: false,
      sortToggle: false,
      advancedSearchToggle: false,
      searchOn: 'search', //Default, searches all searchable fields
      sortBy: '',
      disableEdit: true,

      pageNum: 1,
      next: null,
      previous: null,
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
    this.nextPage.bind(this);
    this.prevPage.bind(this);

  };

  componentDidMount() {
    console.log(`Search is: ${this.state.search}`);
    this.refreshList();
  };

  refreshList = () => {

    console.log(`Search is: ${this.state.search}`);
    console.log(`Searching on: ${this.state.searchOn}`);
    console.log(`Sort is: ${this.state.sortBy}`);
    console.log(`Asking for page ${this.state.pageNum}`);
    console.log(`Advanced search is ${this.state.advancedSearch}`)
    if(this.state.advancedSearch) {
      axios
        .get(`/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.advancedSearch}&${this.state.sortBy}`)
        .then((res) => this.setState({dataList: res.data.results,
                                      next: res.data.next,
                                      previous: res.data.previous}))
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}&${this.state.sortBy}`)
        .then((res) => this.setState({dataList: res.data.results,
                                      next: res.data.next,
                                      previous: res.data.previous}),() => {console.log(`/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}&${this.state.sortBy}`)})
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
        .then((res) => this.refreshList(),
              this.setState({disableEdit: true}));
      return;
    }
    axios
      .post(`/app/${this.state.selection}/`, item)
      .then((res) => this.refreshList(),
            this.setState({disableEdit: true}));
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

    this.setState({ activeItem: item, modal: !this.state.modal, disableEdit: false });
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
    this.setState({ search: target.value, advancedSearch: "" }, () => {this.refreshList()});
    console.log(`Desired ${target.value} vs Current ${this.state.search}`);
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
    
    this.setState({searchOn: e}, () => (this.refreshList()));

  }

  updateAdvancedSearch = (e) => {
    console.log(e);
    this.toggleAdvancedSearch();
  
    this.setState({advancedSearch: e},() => (this.refreshList()))
  }

  toggleSortBy = () => {
    this.setState({sortToggle: !this.state.sortToggle});
  }

  toggleAdvancedSearch = () => {
    this.setState({ advancedSearchToggle: !this.state.advancedSearchToggle });
  };

  updateSort = (e) => {
    console.log(e)
    const sortString = `ordering=${e}&`;
    console.log(`sortString is: ${sortString}`)
    this.toggleSortBy();
    this.setState({sortBy: sortString}, () => this.refreshList());
  }

  nextPage = () => {
    const currPage = this.state.pageNum;
    if(this.state.next){
      this.setState({pageNum: currPage + 1}, () => {this.refreshList()});
    }
  }

  prevPage = () => {
    const currPage = this.state.pageNum;
    if(this.state.previous) {
      this.setState({pageNum: currPage - 1}, () => {this.refreshList()});
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