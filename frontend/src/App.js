import logo from './logo.svg';
import Modal from "./components/Modal.js"
import './App.css';
import React, { Component } from 'react';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      employeeList: [],
      modal: false,
      activeItem: {
        id: "",
        job_title: "",
        phone: ""
      },
    };
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/app/employees/")
      .then((res) => this.setState({employeeList: res.data}))
      .then(console.log("Uhhhhh?"))
      .then(console.log(this.state.activeItem.job_title))
      .then(console.log("Rip?"))
      .catch((err) => console.log(err));

  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      console.log("Item submitted");
      axios
        .put(`/app/employees/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/app/employees", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    
    axios
      .delete(`/app/employees/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { id: "", job_title: "", phone: "" };

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

  renderItems = () => {
    const allItems = this.state.employeeList;
    return allItems.map((item) => (
      <li
        key = {item.id}
        className = "list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className = "Employees"
        >{item.id}: {item.job_title},  {item.phone}
        </span>
        <span>
          <button
            className = "btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
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
      <main className = "container">
        <h1 className= "text-white text-uppercase text-center my-4">Employee app</h1>
        <div className = "row">
          <div className = "col-md-6 col-sm-10 mx-auto p-0">
            <div className = "card p-3">
              <div className = "mb-4">
                <button
                  className = "btn btn-primary"
                  onClick = {this.createItem}
                >
                  Add employee
                </button>
              </div>
              <ul className = "list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem = {this.state.activeItem}
            toggle = {this.toggle}
            onSave = {this.handleSubmit}
            />
        ) : null}
      </main>
    )
  }
}

export default App;
