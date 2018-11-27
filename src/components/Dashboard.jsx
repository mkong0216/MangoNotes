import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid, Breadcrumb, Header } from 'semantic-ui-react'
import SidebarMenu from './SidebarMenu'
import NoteCards from './NoteCards'
import UserMenu from './UserMenu'
import { retrieveNotebook } from '../xhr/notebook'
import { retrieveRecentNotepages } from '../xhr/notepage'

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
    if (this.props.user.signedIn && !this.props.location.state) {
      const path = `/${this.props.match.params.username}/dashboard/workspace`

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
    } else if (historyState.id === 'recent') {
      noteItems = {
        notepages: await retrieveRecentNotepages(this.props.user.signInData.userId)
      }
    }

    this.setState({
      contents: noteItems,
      parentNotebook: (historyState.currentPath.length > 1) ? historyState.currentPath[historyState.currentPath.length - 1] : null
    })
  }

  renderBreadCrumb = (state) => {
    if (!state) return null
    
    const currentPath = state.currentPath
    return currentPath.map((item, i) => {
      const path = item[0].toUpperCase() + item.substring(1)

      return (
        <React.Fragment key={i}>
          <Breadcrumb.Section> { path } </Breadcrumb.Section>
          { (currentPath.length - 1 !== i) && (
            <Breadcrumb.Divider icon="right angle" /> 
          )}
        </React.Fragment>
      )
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
          <Header as="h1" dividing className="nav">
            <Breadcrumb>
              { this.renderBreadCrumb(this.props.location.state) }
            </Breadcrumb>
          </Header>
          <UserMenu />
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
