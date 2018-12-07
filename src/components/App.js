import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Loading from './Loading'
import SignInMenu from './SignInMenu'
import Dashboard from './Dashboard'
import Notepage from './Notepage'

class App extends Component {
  render () {
    return this.props.signInAttempted ? (
    <div className="App">
      <Switch>
        <Route exact path="/" component={SignInMenu} />
        <Route path="/:username/dashboard" component={Dashboard} />
        <Route path="/share/:noteId/:permissions" component={Notepage} />
        <Route path="/:username/notepage/:noteId" component={Notepage} />
      </Switch>
    </div>
    ) : <Loading />
  }
}

function mapStateToProps (state) {
  return {
    signInAttempted: state.user.signInAttempted
  }
}

export default withRouter(connect(mapStateToProps)(App));
