import React from 'react';
import styles from '../css/login.module.css';
import logo from "../images/logo.jpg"


export default function Login() {
  return (
      <section id = 'loginform' className = {styles.center}>

          <div>
              <img src = {logo} alt = "logo" className = {styles.logo}/>
          </div>

          <div className = {styles.text}>
              <p >username</p>
          </div>
          <div>
              <input type="text" data-direction="right"
                  spellcheck="false" autocomplete="off"
                  required="required" placeholder="username" 
                  id = "username" className = {styles.input}/>
            </div>
            
            <div className = {styles.text}>
                <p>password</p>
            </div>
            
            <div>
                <input type="text" data-direction="right"
                spellcheck="false" autocomplete="off"
                required="required" placeholder="password" 
                id = "password"/>
            </div>
            
            <div>
                <input type="submit" value="Login" class="Login-btn" className = {styles.loginButton}/>
            </div>
      </section>
    
    
    
  );
}