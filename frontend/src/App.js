import logo from './logo.svg';
import Modal from "./components/Modal.js"
import './App.css';
import React, {useState, useEffect, Component } from 'react';
import axios from "axios";

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import useToken from './useToken';



import Login from '../src/components/Login'
import Home from '../src/components/Home'
import EmployeeView from '../src/components/EmployeeView'



function App() {
  // need a way to say this is my first time rendering, so don't have to check mounted before rendering

  console.log("app executes");
  const { key, setToken } = useToken();

  
  if(!key) {
    console.log("if statement executes");

    return (<Login setToken={setToken}/>)
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
