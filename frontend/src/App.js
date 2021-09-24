import logo from './logo.svg';
import Modal from "./components/Modal.js"
import './App.css';
import React, { Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';




import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'
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
        </Switch>
      </BrowserRouter>

    </div>
  );
}


export default App;
