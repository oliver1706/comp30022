
import CustomerModal from './CustomerModal.js'
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
import getAuthheader from '../Authentication.js';

export default class AbstractView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      selection: '',
      dataList: [],
      modal: false,
      newEmployee: false,
      customer: false,
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
    this.updateSearchBar.bind(this);
    this.nextPage.bind(this);
    this.prevPage.bind(this);

  };

  componentDidMount() {
    console.log(`Search is: ${this.state.search}`);
    console.log(sessionStorage.getItem("key"));
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
        .get(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.advancedSearch}&${this.state.sortBy}`, getAuthheader())
        .then((res) => this.setState({dataList: res.data.results,
                                      next: res.data.next,
                                      previous: res.data.previous}))
        .catch((err) => console.log(err));
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}&${this.state.sortBy}`, getAuthheader())
        .then((res) => this.setState({dataList: res.data.results,
                                      next: res.data.next,
                                      previous: res.data.previous}),() => {console.log(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/?page=${this.state.pageNum}&${this.state.searchOn}=${this.state.search}&${this.state.sortBy}`)})
        .catch((err) => console.log(err));
    }
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggleExistingCustomer = () => {
    this.setState({ customer: !this.state.customer });
  };


  toggleNewEmployee = () => {
    this.setState({newEmployee: !this.state.newEmployee})
  }


  handleSubmit = (item) => {

    console.log(item)
    this.toggle();

    if (item.id) {
      console.log('Item submitted');
      axios
        .patch(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/${item.id}/`, item, getAuthheader())
        .then((res) => this.refreshList(),
              this.setState({disableEdit: true}));
      return;
    }
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/`, item, getAuthheader())
      .then((res) => this.refreshList(),
            this.setState({disableEdit: true}));
  };


  handleExistingCustomer = (item) => {

    console.log(item)
    this.toggleExistingCustomer();

    if (item.id) {
      console.log('Item submitted');
      axios
        .patch(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/${item.id}/`, item, getAuthheader())
        .then((res) => this.refreshList(),
              this.setState({disableEdit: true}));
      return;
    }
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/`, item, getAuthheader())
      .then((res) => this.refreshList(),
            this.setState({disableEdit: true}));
  };


  addEmployee = (item) => {

    console.log(item)
    this.toggleNewEmployee();

    if (item.id) {
      console.log('Item submitted');
      axios
        .patch(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/${item.id}/`, item, getAuthheader())
        .then((res) => this.refreshList(),
              this.setState({disableEdit: true}));
      return;
    }
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/`, item, getAuthheader())
      .then((res) => this.refreshList(),
            this.setState({disableEdit: true}));
  };

  handleDelete = (item) => {
    
    axios
      .delete(process.env.REACT_APP_BACKEND_URL + `/app/${this.state.selection}/${item.id}/`, getAuthheader())
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
    this.setState({ activeItem: item, customer: !this.state.customer });
  };

  editEmployee = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };




  updateSearchBar = (e) => {
    const target = e.target;
    this.setState({ search: target.value, advancedSearch: "" }, () => {this.refreshList()});
    console.log(`Desired ${target.value} vs Current ${this.state.search}`);
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
}