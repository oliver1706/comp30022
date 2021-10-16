import logo from './logo.svg';

import './App.css';
import React, {useState, useEffect, Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import useToken from './useToken';

import getAuthheader from './Authentication';
import AdvancedSearch from '../src/components/AdvancedSearch.js'
import EmployeeModal from "./components/EmployeeModal.js"
import CustomerModal from "./components/CustomerModal"
import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'
import CustomerView from '../src/components/CustomerView'
import CustomerInvoices from '../src/components/CustomerInvoices'
import CustomerStatistics from '../src/components/CustomerStatistics'
import DepartmentAndOrganisationView from './components/DepartmentAndOrganisationView'
import DepartmentView from './components/DepartmentView'
import OrganisationView from './components/OrganisationView'
function App() {
  // need a way to say this is my first time rendering, so don't have to check mounted before rendering

  console.log("app executes");
  const { key, setToken } = useToken();

  
  if(!key) {
    console.log("if statement executes");

    return (<Login setToken={setToken}/>)
  }

  //I think this might be terrible but no idea how else to do it, apolagies - Max
  let allCustIds;

  axios
        .get(process.env.REACT_APP_BACKEND_URL + `/app/customers/`, getAuthheader())
        .then((res) =>console.log(res)).catch((err) => console.log(err));
        /*.then((res) => this.setState({dataList: res.data.results,
                                      next: res.data.next,
                                      previous: res.data.previous}))
        .catch((err) => console.log(err));*/
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
        <Route exact path = '/'>
            <Home/>
          </Route>
          <Route path = '/employees'>
            <EmployeeView/>
          </Route>
          <Route path = '/customers'>
            <CustomerView/>
          </Route>
          <Route path = '/invoicetest'>
            <CustomerInvoices customerId={8}/>
          </Route>
          <Route path = '/departments'>
            <DepartmentView/>
          </Route>
          <Route path = '/organisations'>
            <OrganisationView/>
          </Route>
          <Route path = '/viewplot'>
            <CustomerStatistics/>
          </Route>
          <Route path = '/viewplot'>
            <CustomerStatistics/>
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}


export default App;
