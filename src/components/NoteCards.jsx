import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image } from 'semantic-ui-react'
import CreateModal from './CreateModal'
import ContextMenu from './ContextMenu'

import { getElAbsolutePos } from '../utils'
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
    history: PropTypes.object.isRequired,
    handleNoteChanges: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
      showMenu: false,
      contextMenuItem: null,
      itemType: null,
      menuPosition: null
    }
  }

  componentDidMount () {
    window.addEventListener("click", this.hideContextMenu)
  }

  componentWillUnmount () {
    window.removeEventListener("click", this.hideContextMenu)
  }

  hideContextMenu = (event) => {
    if (this.state.showMenu) {
      this.setState({ showMenu: false })
    }
    return
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  handleNoteCardClick = (item, type) => {
    const historyState = this.props.history.location.state
    if (historyState.id === 'trash') return
  
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

  showContextMenu = (event, item, type) => {
    event.preventDefault()

    const el = (event.target.parentElement.nodeName === 'A') ? event.target.parentElement : event.target.parentElement.parentElement
    const position = getElAbsolutePos(el)

    this.setState({
      showMenu: true,
      contextMenuItem: item,
      menuPosition: position,
      itemType: type
    })
  }

  renderNoteCards = (items, type) => {
    if (!items) return null

    return items.map((item, i) => {
      const dateModified = new Date(item.updatedAt)
      const modifiedOn = `Last modified on ${dateModified.toDateString()}`

      return (
        <Card
          key={i}
          link={this.props.history.location.state.id !== 'trash'}
          onClick={() => { this.handleNoteCardClick(item, type) }}
          onContextMenu={(event) => { this.showContextMenu(event, item, type) }}
        >
          <Image
            src={(type === 'notebook') ? notebookIcon : notepageIcon}
            label={{ as: 'span', corner: 'right', color: 'yellow', icon: (item.starred) ? 'star' : 'star outline' }}
          />
          <Card.Content>
            <Card.Header> { item.title } </Card.Header>
            <Card.Meta>
              <span className='date'> { modifiedOn} </span>
            </Card.Meta>
          </Card.Content>
        </Card>
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
        <ContextMenu
          showMenu={this.state.showMenu}
          menuPosition={this.state.menuPosition}
          contextMenuItem={this.state.contextMenuItem}
          type={this.state.itemType}
          hideContextMenu={this.hideContextMenu}
          handleNoteChanges={this.props.handleNoteChanges}
          historyState={historyState}
        />
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