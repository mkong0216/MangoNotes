import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import SignInMenu from './SignInMenu'
import NotePage from './NotePage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignInMenu} />
          <Route path="/notepage" component={NotePage} />
        </Switch>
      </div>
    );
  }
}

export default App;