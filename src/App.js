import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';


import Home from './components/home/Home'

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
