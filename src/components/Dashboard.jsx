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
import { getStarredNoteItems, getTrashNoteItems, retrieveUsersWork } from '../xhr/user'

/**
 * Dashboard.jsx
 * 
 * Displays user's notebooks and notepages.
 */

class Dashboard extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    shared: PropTypes.array,
    user: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      contents: null,
      parentNotebook: null,
      checkUpdate: false
    }
  }

  componentDidMount () {
    this.setState({ checkUpdate: true })
    window.addEventListener('mangonotes:creation', this.getNotebooksAndNotepages)
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname || this.state.checkUpdate) {
      this.getNotebooksAndNotepages()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('mangonotes:creation', this.getNotebooksAndNotepages)
  }

  handleNoteChanges = () => { this.setState({ checkUpdate: true }) }

  getNotebooksAndNotepages = async () => {
    const historyState = this.props.location.state
    let noteItems = {}

    try {
      switch (historyState.id) {
        case 'workspace':
          noteItems = await retrieveUsersWork(this.props.user.signInData.userId)
          break;
        case 'recent':
          noteItems.notepages = await retrieveRecentNotepages(this.props.user.signInData.userId)
          break;
        case 'starred':
          noteItems = await getStarredNoteItems(this.props.user.signInData.userId)
          break;
        case 'shared':
          const { shared } = await retrieveUsersWork(this.props.user.signInData.userId)
          noteItems.notepages = shared
          break;
        case 'trash':
          noteItems = await getTrashNoteItems(this.props.user.signInData.userId)
          break;
        default:
          if (historyState.type === 'notebook' && historyState.noteId) {
            const results = await retrieveNotebook(historyState.noteId, this.props.user.signInData.userId)
            noteItems = results.contents
          }
          break;
      }

      this.setState({
        checkUpdate: false,
        contents: noteItems,
        parentNotebook: (historyState.currentPath.length > 1) ? historyState.currentPath[historyState.currentPath.length - 1] : null
      })
    } catch (error) {
      console.log(error)
      this.setState({ checkUpdate: false })
    }
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
        <Grid.Column width={12}>
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
            handleNoteChanges={this.handleNoteChanges}
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
    user: state.user
  }
}

export default connect(mapStateToProps)(Dashboard)
