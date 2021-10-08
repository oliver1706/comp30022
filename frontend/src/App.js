import logo from './logo.svg';

import './App.css';
import React, { Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';



import Modal from "./components/Modal.js"
import CustomerModal from "./components/CustomerModal"
import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'
import CustomerView from '../src/components/CustomerView'
import CustomerInvoices from '../src/components/CustomerInvoices'
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
        </Switch>
      </BrowserRouter>

    </div>
  );
}


export default App;
