import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid } from 'semantic-ui-react'
import SidebarMenu from './SidebarMenu'
import NoteCards from './NoteCards'

/**
 * Dashboard.jsx
 * 
 * Displays user's notebooks and notepages.
 */

class Dashboard extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    signedIn: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      currentPath: []
    }
  }

  updateCurrentPath = (path) => { this.setState({ currentPath: path }) }

  render () {
    const { currentPath } = this.state
    const parentNotebook = (currentPath.length > 1) ? currentPath[currentPath.length - 1] : null

    return this.props.signedIn ? (
      <Grid className="dashboard">
        <Grid.Column width={3}>
          <SidebarMenu updateCurrentPath={this.updateCurrentPath} />
        </Grid.Column>
        <Grid.Column width={13}>
          <NoteCards items={this.props.notebooks} parentNotebook={parentNotebook} />
        </Grid.Column>
      </Grid>
    ) : (
      <Redirect to='/' />
    )
  }
}

function mapStateToProps (state) {
  return {
    notebooks: state.notebooks.userNotebooks,
    notepages: state.notepages.userNotepages,
    signedIn: state.user.signedIn
  }
}

export default connect(mapStateToProps)(Dashboard)
