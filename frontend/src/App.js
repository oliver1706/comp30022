import logo from './logo.svg';

import './App.css';
import React, { Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';



import EmployeeModal from "./components/EmployeeModal.js"
import CustomerModal from "./components/CustomerModal"
import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'
import CustomerView from '../src/components/CustomerView'
import CustomerInvoices from '../src/components/CustomerInvoices'
import CustomerStatistics from '../src/components/CustomerStatistics'
import DepartmentAndOrganisationView from './components/DepartmentAndOrganisationView'
function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path = '/app/accounts/login/'>
            <Login/>
          </Route>
          <Route path = '/app/home/'>
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
            <DepartmentAndOrganisationView selection='department'/>
          </Route>
          <Route path = '/organisations'>
            <DepartmentAndOrganisationView selection='organisation'/>
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
