import React from 'react';
import Login from './Components/Login/login';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
            <div>
            <Route path="/Login" component={Login}/>
            </div>
    </BrowserRouter>
  );
}

export default App;
