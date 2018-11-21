import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

class Dashboard extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    signedIn: PropTypes.bool.isRequired
  }

  render () {
    return this.props.signedIn ? (
      <div> Testing </div>
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
