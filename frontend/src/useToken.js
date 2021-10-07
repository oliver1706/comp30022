import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
      const tokenString = sessionStorage.getItem('key');
      const userToken = JSON.parse(tokenString);
      return userToken?.key
    };
    
    const [key, setToken] = useState(getToken());
  
    const saveToken = userToken => {
      sessionStorage.setItem('key', JSON.stringify(userToken));
      setToken(userToken.token);
    };
  
    return {
      setToken: saveToken,
      key
    }
  }