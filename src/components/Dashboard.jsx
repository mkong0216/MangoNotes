import React from 'react'

import SidebarMenu from './SidebarMenu'
import Workspace from './Workspace'
import { Header, Breadcrumb } from 'semantic-ui-react'

class Dashboard extends React.Component {
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
    return (
      <div id="dashboard">
        <SidebarMenu updateCurrentPath={this.updateCurrentPath} />
        <Header block className="user-path">
          <Breadcrumb>
            { this.renderCurrentPath(this.state.currentPath) }
          </Breadcrumb>
        </Header>
        <Workspace updateCurrentPath={this.updateCurrentPath} currPath={this.state.currentPath} />
      </div>
    )
  }
}

export default Dashboard