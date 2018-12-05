import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import SignInMenu from './SignInMenu'
import Dashboard from './Dashboard'
import Notepage from './Notepage'

class App extends Component {
  render() {
    if (!this.props.signedInAttempted) return null

    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignInMenu} />
          <Route path="/:username/dashboard" component={Dashboard} />
          <Route path="/:username/notepage" component={Notepage} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    signedInAttempted: state.user.signedInAttempted
  }
}

export default connect(mapStateToProps)(App);