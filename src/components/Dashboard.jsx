import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid } from 'semantic-ui-react'
import SidebarMenu from './SidebarMenu'

class Dashboard extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    signedIn: PropTypes.bool.isRequired
  }

  render () {
    return this.props.signedIn ? (
      <Grid className="dashboard">
        <Grid.Column width={3}>
          <SidebarMenu />
        </Grid.Column>
        <Grid.Column width={13}>
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
