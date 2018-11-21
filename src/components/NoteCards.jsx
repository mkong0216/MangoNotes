import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'
import { updateBrowserHistory } from '../utils'

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
    updateCurrentPath: PropTypes.func.isRequired
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
    const currPath = (window.location.pathname).split('/').slice(1)

    const state = {
      id: item.title,
      noteId: (type === 'notebook') ? item.notebookId : item.notepageId,
      type
    }

    if (currPath[currPath.length - 1] === state.noteId) return

    const url = `/${currPath[0]}/${type}/${state.noteId}`
    updateBrowserHistory(state, url)
    this.props.updateCurrentPath(item.title)
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
    return (
      <React.Fragment>
        <Card.Group className="notecards" itemsPerRow={5}>
          <Card color="olive" image={plus} link onClick={this.toggleModal} />
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