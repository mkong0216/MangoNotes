import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'
import RenameModal from './RenameModal'
import MoveItemModal from './MoveItemModal'
import ShareModal from './ShareModal'
import '../css/ContextMenu.css'

class ContextMenu extends React.Component {
  static propTypes = {
    showMenu: PropTypes.bool.isRequired,
    contextMenuItem: PropTypes.object,
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

  handleMenuClick = (event, { name }) => {
    event.stopPropagation()
    this.setState({ activeMenuItem: name })
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

    return (this.props.contextMenuItem) ? (
      <React.Fragment>
        { this.props.showMenu && (
          <Menu pointing vertical compact className="context-menu" style={style}>
            <Menu.Item name="Rename" link onClick={this.handleMenuClick}> Rename </Menu.Item>
            <Menu.Item name="Remove" link onClick={this.handleMenuClick}> Remove </Menu.Item>
            <Menu.Item name="Starred" link onClick={this.handleMenuClick}> Add to starred </Menu.Item>
            <Menu.Item name="Share" link onClick={this.handleMenuClick}> Share </Menu.Item>
            <Menu.Item name="Move" link onClick={this.handleMenuClick}> Move to... </Menu.Item>
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