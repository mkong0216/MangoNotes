import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Redirect } from 'react-router'
import SidebarMenu from './SidebarMenu'
import Workspace from './Workspace'
import { Header, Breadcrumb } from 'semantic-ui-react'

class Dashboard extends React.Component {
  static propTypes = {
    signedIn: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      currentPath: ['My Workspace']
    }
  }

  updateCurrentPath = (path, pathIndex) => {
    if (pathIndex || (!pathIndex && !Array.isArray(path))) {
      this.setState({
        currentPath: this.state.currentPath.slice(0, pathIndex + 1)
      })
    } else {
      this.setState({ currentPath: path })
    }
  }

  renderCurrentPath = (currentPath) => {
    return currentPath.map((path, i) => {
      return (
        <React.Fragment key={i}>
          <Breadcrumb.Section onClick={() => { this.updateCurrentPath(path, i) }}> { path } </Breadcrumb.Section>
          { currentPath.length !== i + 1 && (
            <Breadcrumb.Divider icon="right angle" />
          )}
        </React.Fragment>
      )
    })
  }

  render () {
    if (this.props.signedIn) {
      return (
        <div id="dashboard">
          <SidebarMenu updateCurrentPath={this.updateCurrentPath} />
          <Header block className="user-path">
            <Breadcrumb>
              { this.renderCurrentPath(this.state.currentPath) }
            </Breadcrumb>
          </Header>
          { this.state.currentPath[0] === 'My Workspace' && (
            <Workspace updateCurrentPath={this.updateCurrentPath} currPath={this.state.currentPath} />
          )}
        </div>
      )
    } else {
      return (
        <Redirect to={'/'} />
      )
    }
  } 
}

function mapStateToProps (state) {
  return {
    signedIn: state.user.signedIn
  }
}

export default connect(mapStateToProps)(Dashboard)
