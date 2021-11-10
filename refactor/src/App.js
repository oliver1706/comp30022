import logo from './logo.svg';
import useToken from './useToken.js';
import './App.css';
import Login from './components/main/Login'
import Home from './components/main/Home.js'
import {HomeButton, MenuButton, AddItemButton} from './components/header/HeaderButtons.js'
function App() {

  const { key, setToken } = useToken();

  
  if(!key) {
    return (<Login setToken={setToken}/>)
  }

  return (
    <Home/>
  )
}

export default App;
