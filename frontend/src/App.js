import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

const defaultEmployees = [
  {
    id: 0,
    job_title: "Back End",
    phone: "There isn't a name field this is Oliver",
  },
  {
    id: 1,
    job_title: "Front End",
    phone: "Max",
  },
  {
    id: 2,
    job_title: "Designer",
    phone: "Patrick",
  },
  {
    id: 3,
    job_title: "Back End",
    phone: "Alice"
  },
  {
    id: 4,
    job_title: "Back End",
    phone: "Marlon",
  }


]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      employeeList: [],
    };
  };


  displayAll = (status) => {
    if (status) {
      return this.setState({ viewAll: true });
    } else {
      return this.setState({ viewAll: false});
    }
  }

  renderItems = () => {
    const { viewCompleted } = this.state;
    const allItems = this.state.employeeList;
    return allItems.map((item) => (
      <li
        key = {item.id}
        className = "list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className = "Employees"
        >{item.id}: {item.phone},  {item.job_title}
        </span>
        <span>
          <button
            className = "btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
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
      </main>
    )
  }
}




export default App;
