import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Auth from './lib/auth';
import HomeComponents from './components/HomeComponents';
import Login from './components/Login';
const auth = new Auth();

class App extends Component {
  render() {
   return (
      <Router>
        <div>
          <Route path="/home" render={(props) => <HomeComponents auth={auth} {...props} />} />
          <Route exact path="/" render={(props) => <Login auth={auth} {...props} />} />
        </div>
      </Router>
   );
  }
}
export default App;