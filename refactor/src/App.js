import logo from './logo.svg';
import useToken from './useToken.js';
import './App.css';
import Login from './components/main/Login'
import Home from './components/main/Home.js'
import {HomeButton, MenuButton, AddItemButton} from './components/header/HeaderButtons.js'
function App() {

  console.log("app executes");
  const { key, setToken } = useToken();

  
  if(!key) {
    console.log("if statement executes");

    return (<Login setToken={setToken}/>)
  }

  return (
    <Home/>
  )
}

export default App;
