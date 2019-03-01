import React, { Component } from 'react';

import Main from './components/containers/main.component';
import './styles/custom.css'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Main />
      </div>
    );
  }
}

export default App;
