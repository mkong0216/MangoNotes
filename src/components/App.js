import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import SignInMenu from './SignInMenu'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignInMenu} />
        </Switch>
      </div>
    );
  }
}

export default App;