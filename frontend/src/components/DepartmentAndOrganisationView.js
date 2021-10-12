
import DepartmentAndOrganisationModal from './DepartmentAndOrganisationModal.js'
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

export default class DepartmentAndOrganisationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      dataList: [],
      modal: false,
      search: '',
      activeItem: {
        id: '', 
        name: ''
      },

    };
    this.handleChange.bind(this);

  };

  componentDidMount() {
    this.refreshList();
  };

  refreshList = () => {

    if(this.state.search.length !== 0) {
        axios.get(process.env.REACT_APP_BACKEND_URL + `/app/${this.props.selection}s/?search=${this.state.search}`)
        .then((res) => this.setState({dataList: res.data.results}))
        .catch((err) => console.log(err));
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + `/app/${this.props.selection}s/`)
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
        .patch(process.env.REACT_APP_BACKEND_URL + `/app/${this.props.selection}s/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/app/${this.props.selection}s/`, item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(process.env.REACT_APP_BACKEND_URL + `/app/${this.props.selection}s/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = {
                id: '', 
                name: ''
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
  };

  renderItems = () => {
    const allItems = this.state.dataList;
    return allItems.map((item) => (
      <li
        key = {item.id}
        className = 'list-group-item d-flex justify-content-between align-items-center'
      >
        <span>
          {item.name}
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
        <h1 className= 'text-white text-uppercase text-center my-4'>
          {this.props.selection.charAt(0).toUpperCase() + this.props.selection.slice(1)} app
        </h1>
        <div className = 'row'>
          <div className = 'col-md-30 col-sm-10 mx-auto p-0'>
            <div className = 'card p-3'>
              <div className = 'mb-4'>
                <button
                  className = 'btn btn-primary'
                  onClick = {this.createItem}
                >
                  Add {this.props.selection.charAt(0).toUpperCase() + this.props.selection.slice(1)}
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
          <DepartmentAndOrganisationModal
            activeItem = {this.state.activeItem}
            selection = {this.props.selection}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
      </main>
    )
  };
}

