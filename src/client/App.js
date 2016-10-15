import React, { Component } from 'react';

import History from './containers/History';
import Header from './containers/Header';
import LoginPage from './containers/LoginPage';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <LoginPage />
          <History />
      </div>
    );
  }
}

export default App;
