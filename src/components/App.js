import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import SignInMenu from './SignInMenu'
import Workspace from './Workspace'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignInMenu} />
          <Route path="/:username" component={Workspace} />
        </Switch>
      </div>
    );
  }
}

export default App;