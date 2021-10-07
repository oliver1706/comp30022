import React, {Component, useState} from 'react';
import styles from '../css/login.module.css';
import logo from "../images/logo.jpg";

import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './Home';


async function loginUser(credentials) {
    return fetch(`/app/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())

   }



export default function Login({ setToken }, mounted) {
    const [username, setUserName] = useState(null);
    const [password, setPassword] = useState(null);

    const handleSubmit = async e => {
      console.log(mounted);
      mounted = true;
        e.preventDefault();
        const key = await loginUser({
          username,
          password
        });
        if (mounted) {
          setToken(key);
        }
        
        mounted = false;
        console.log(mounted);



    }
    return (
      <div>
        <div id = 'logo' className = {styles.logo}>
          <img src = {logo} alt = "logo" className = {styles.largeLogo}/>
        </div>

    <form onSubmit={handleSubmit} className = {styles.loginCredentials}>

    <label>
      <p className = {styles.text}>Username</p>
      <input placeholder = 'username' className = {styles.input} type="text" onChange={e => setUserName(e.target.value)}/>
    </label>
    <label>
      <p className = {styles.text}>Password</p>
      <input placeholder = 'password' className = {styles.input} type="password" onChange={e => setPassword(e.target.value)}/>
    </label>
    <div>
      <button className = {styles.loginButton}   type="submit">Login</button>
    </div>
  </form>
  </div>
  );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }

