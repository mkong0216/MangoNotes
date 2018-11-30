import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'

import plus from '../images/plus-icon.png'
import notebookIcon from '../images/notebook.png'
import notepageIcon from '../images/notepage.png'
import '../css/NoteCards.css'

/**
 * NoteCards.jsx
 *
 * Displays Notebook and Notepage information in card form.
 */

class NoteCards extends React.Component {
  static propTypes = {
    parentNotebook: PropTypes.string,
    notebooks: PropTypes.array,
    notepages: PropTypes.array,
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  handleNoteCardClick = (item, type) => {
    const historyState = this.props.history.location.state

    const state = {
      id: item.title,
      noteId: (type === 'notebook') ? item.notebookId : item.notepageId,
      type,
      currentPath: [...historyState.currentPath, item.title],
      user: historyState.user
    }

    if (state.currentPath[state.currentPath.length - 1] === state.noteId) return

    let path = `/${historyState.user}`
    if (type === 'notebook') {
      path += `/dashboard/${type}/${state.noteId}`
      this.props.history.push({ pathname: path, state })
    } else {
      path += `/${type}/${state.noteId}`
      this.props.history.push({ pathname: path, state })
    }
  }

  renderNoteCards = (items, type) => {
    if (!items) return null

    return items.map((item, i) => {
      const dateModified = new Date(item.updatedAt)
      const modifiedOn = `Last modified on ${dateModified.toDateString()}`

      return (
        <Card
          key={i}
          image={(type === 'notebook') ? notebookIcon : notepageIcon}
          header={item.title}
          meta={modifiedOn}
          link
          onClick={() => { this.handleNoteCardClick(item, type) }}
        />
      )
    })
  }

  render () {
    const historyState = this.props.history.location.state
    const createNewCard = (historyState && historyState.currentPath.includes('workspace')) && (
      <Card color="olive" image={plus} link onClick={this.toggleModal} />
    )
  
    return (
      <React.Fragment>
        <Card.Group className="notecards" itemsPerRow={5}>
          { createNewCard }
          { this.renderNoteCards(this.props.notebooks, 'notebook') }
          { this.renderNoteCards(this.props.notepages, 'notepage') }
        </Card.Group>
        <CreateModal
          open={this.state.showModal}
          toggleModal={this.toggleModal}
          parentNotebook={this.props.parentNotebook}
        />
      </React.Fragment>
    )
  }
}

export default NoteCards