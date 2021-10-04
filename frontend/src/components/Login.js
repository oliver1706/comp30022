import React, {useState} from 'react';
import styles from '../css/login.module.css';
import logo from "../images/logo.jpg";

import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './Home';

async function loginUser(credentials) {
    let mounted = true
    return fetch(`/app/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())

   }



export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const key = await loginUser({
          username,
          password
        });
        setToken(key);
    }
    return (
      <div>
    <form onSubmit={handleSubmit}>
    <label>
      <p>Username</p>
      <input type="text" onChange={e => setUserName(e.target.value)}/>
    </label>
    <label>
      <p>Password</p>
      <input type="password" onChange={e => setPassword(e.target.value)}/>
    </label>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
  </div>
  );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }