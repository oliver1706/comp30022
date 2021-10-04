import logo from './logo.svg';
import Modal from "./components/Modal.js"
import './App.css';
import React, {useState, Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import useToken from './useToken';



import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'




function App() {
  
  const { key, setToken } = useToken();

// this is always true even when we have a token in session storage

  if(!key) {
    console.log("YUhhhh")
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path = ''>
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
