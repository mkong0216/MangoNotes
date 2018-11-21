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
      currentPath: ['workspace'],
      contents: null,
      parentNotebook: null
    }
  }

  updateCurrentPath = (path, isMenuItem) => {
    const currentPath = (isMenuItem) ? path : this.state.currentPath.concat(path)
    const parentNotebook = (currentPath.length > 1) ? currentPath[currentPath.length - 1] : null
    this.setState({ currentPath, parentNotebook })

    this.getNotebooksAndNotepages(parentNotebook)
  }

  getNotebooksAndNotepages = async (parentNotebook) => {
    const historyState = window.history.state

    let noteItems = {}

    if (!parentNotebook && this.state.currentPath[0] === 'workspace') {
      noteItems = {
        notebooks: this.props.notebooks,
        notepages: this.props.notepages
      }
    } else if (parentNotebook && historyState.type === 'notebook') {
      noteItems = await retrieveNotebook(historyState.noteId, this.props.user.signInData.userId)
    }

    console.log(noteItems)
    this.setState({ contents: noteItems })
  }

  render () {
    const { parentNotebook, contents } = this.state

    return this.props.user.signedIn ? (
      <Grid className="dashboard">
        <Grid.Column width={3}>
          <SidebarMenu updateCurrentPath={this.updateCurrentPath} />
        </Grid.Column>
        <Grid.Column width={13}>
          <NoteCards
            notebooks={contents && contents.notebooks}
            notepages={contents && contents.notepages}
            parentNotebook={parentNotebook}
            updateCurrentPath={this.updateCurrentPath}
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
