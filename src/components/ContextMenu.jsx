import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'
import RenameModal from './RenameModal'
import MoveItemModal from './MoveItemModal'
import ShareModal from './ShareModal'

import { TYPE_NOTEPAGE, TYPE_NOTEBOOK } from '../utils'
import { updateNotebook, removeNotebook } from '../xhr/notebook'
import { updateNotepage, removeNotepage } from '../xhr/notepage'

import '../css/ContextMenu.css'

class ContextMenu extends React.Component {
  static propTypes = {
    showMenu: PropTypes.bool.isRequired,
    contextMenuItem: PropTypes.object,
    hideContextMenu: PropTypes.func.isRequired,
    handleNoteChanges: PropTypes.func.isRequired,
    historyState: PropTypes.object.isRequired,
    userId: PropTypes.string,
    menuPosition: PropTypes.array,
    type: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      activeMenuItem: null,
    }
  }

  handleMenuClick = async (event, { name }) => {
    event.stopPropagation()
    this.setState({ activeMenuItem: name })

    if (name === 'Starred' || name === 'Remove' || name === 'Restore') {
      const { updatedAt, ...noteItem } = this.props.contextMenuItem
      noteItem.starred = (name === 'Starred') ? !noteItem.starred : noteItem.starred
      
      if (name === 'Remove') {
        noteItem.removed = true
      } else if (name === 'Restore') {
        noteItem.removed = false
      }

      if (this.props.type === TYPE_NOTEBOOK) {
        await updateNotebook(noteItem, this.props.userId)
      } else if (this.props.type === TYPE_NOTEPAGE) {
        await updateNotepage(noteItem, this.props.userId)
      }
    }

    this.props.handleNoteChanges()
    this.props.hideContextMenu()
  }

  handleDelete = async (event) => {
    event.stopPropagation()
    
    const { updatedAt, ...noteItem } = this.props.contextMenuItem
    if (this.props.type === TYPE_NOTEBOOK) {
      await removeNotebook(noteItem, this.props.userId)
    } else if (this.props.type === TYPE_NOTEPAGE) {
      await removeNotepage(noteItem, this.props.userId)
    }

    this.props.handleNoteChanges()
    this.props.hideContextMenu()
  }

  closeModal = () => { this.setState({ activeMenuItem: null }) }

  renderModal = (activeMenuItem) => {
    const props = {
      closeModal: this.closeModal,
      noteItem: this.props.contextMenuItem,
      type: this.props.type,
      userId: this.props.userId,
      handleNoteChanges: this.props.handleNoteChanges,
      open: true
    }

    switch (activeMenuItem) {
      case 'Rename':
        return <RenameModal {...props} />
      case 'Move':
        const { historyState } = this.props
        const parentNotebook = (historyState.id === 'workspace') ? null : historyState.noteId
        return <MoveItemModal {...props} parentNotebookId={parentNotebook} />
      case 'Share':
        return <ShareModal {...props} />
      default:
        return null
    }
  }

  render () {
    const style = {
      left: this.props.menuPosition && (this.props.menuPosition[0] - 50) + 'px',
      top: this.props.menuPosition && this.props.menuPosition[1] + 'px'
    }

    const { contextMenuItem, historyState } = this.props

    return (this.props.contextMenuItem) ? (
      <React.Fragment>
        { this.props.showMenu && (
          <Menu pointing vertical compact className="context-menu" style={style}>
            { historyState.id !== 'trash' &&
              <React.Fragment>
                <Menu.Item name="Rename" link onClick={this.handleMenuClick}> Rename </Menu.Item>
                <Menu.Item name="Starred" link onClick={this.handleMenuClick}>
                  { (contextMenuItem && contextMenuItem.starred) ? 'Remove from starred' : 'Add to starred' }
                </Menu.Item>
                { this.props.type === TYPE_NOTEPAGE && 
                  <Menu.Item name="Share" link onClick={this.handleMenuClick}> Share </Menu.Item>
                }
                <Menu.Item name="Move" link onClick={this.handleMenuClick}> Move to... </Menu.Item>
                <Menu.Item name="Remove" link onClick={this.handleMenuClick}> Remove </Menu.Item>
              </React.Fragment>
            }
            { historyState.id === 'trash' &&
              <React.Fragment>
                <Menu.Item name="Delete" link onClick={this.handleDelete}> Delete </Menu.Item>
                <Menu.Item name="Restore" link onClick={this.handleMenuClick}> Restore </Menu.Item>
              </React.Fragment>
            } 
          </Menu>
        ) }
        
        { this.renderModal(this.state.activeMenuItem) }
      </React.Fragment>
    ) : null
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.signInData.userId
  }
}

export default connect(mapStateToProps)(ContextMenu)