import * as React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Router>
          <Route exact={true} path="/" component={HomePage} />
        </Router>
      </div>
    );
  }
}

export default App;
