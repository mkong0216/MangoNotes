import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid } from 'semantic-ui-react'
import SidebarMenu from './SidebarMenu'
import NoteCards from './NoteCards'
import { retrieveNotebook } from '../xhr/notebook'

/**
 * Dashboard.jsx
 * 
 * Displays user's notebooks and notepages.
 */

class Dashboard extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    user: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      contents: null,
      parentNotebook: null
    }
  }

  componentDidMount () {
    if (this.props.user.signedIn) {
      const path = `/${this.props.match.params.username}/workspace`

      const state = {
        id: 'workspace',
        currentPath: ['workspace'],
        user: this.props.match.params.username
      }
      this.props.history.replace({ pathname: path, state })
    }

    window.addEventListener('mangonotes:creation', this.getNotebooksAndNotepages)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.getNotebooksAndNotepages()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('mangonotes:creation', this.getNotebooksAndNotepages)
  }

  getNotebooksAndNotepages = async () => {
    const historyState = this.props.location.state
    let noteItems = {}

    if (historyState.id === 'workspace') {
      noteItems = {
        notebooks: this.props.notebooks,
        notepages: this.props.notepages
      }
    } else if (historyState.type === 'notebook' && historyState.noteId) {
      noteItems = await retrieveNotebook(historyState.noteId, this.props.user.signInData.userId)
    }

    this.setState({
      contents: noteItems,
      parentNotebook: (historyState.currentPath.length > 1) ? historyState.currentPath[historyState.currentPath.length - 1] : null
    })
  }

  render () {
    const { parentNotebook, contents } = this.state

    return this.props.user.signedIn ? (
      <Grid className="dashboard">
        <Grid.Column width={3}>
          <SidebarMenu history={this.props.history} />
        </Grid.Column>
        <Grid.Column width={13}>
          <NoteCards
            notebooks={contents && contents.notebooks}
            notepages={contents && contents.notepages}
            parentNotebook={parentNotebook}
            history={this.props.history}
          />
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
    user: state.user
  }
}

export default connect(mapStateToProps)(Dashboard)
