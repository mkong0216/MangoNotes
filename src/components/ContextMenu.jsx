import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Modal, Input, Button, List, Image } from 'semantic-ui-react'
import { updateNotebook, retrieveNotebook } from '../xhr/notebook'
import { updateNotepage } from '../xhr/notepage';
import notebookIcon from '../images/notebook.png'

class ContextMenu extends React.Component {
  static propTypes = {
    showMenu: PropTypes.bool.isRequired,
    contextMenuItem: PropTypes.object,
    handleNoteChanges: PropTypes.func.isRequired,
    historyState: PropTypes.object.isRequired,
    userId: PropTypes.string,
    menuPosition: PropTypes.array
  }

  constructor (props) {
    super(props)

    this.state = {
      activeMenuItem: null,
      openModal: false,
      item: null,
      notebookId: null,
      notebooks: props.notebooks
    }
  }

  async componentDidUpdate (prevProps) {
    if (!prevProps.showMenu && this.props.showMenu) {
      this.setState({ item: this.props.contextMenuItem })
    } else if (prevProps.historyState && this.props.historyState && prevProps.historyState.noteId !== this.props.historyState.noteId) {

      if (!this.props.historyState.noteId) {
        this.setState({ notebooks: this.props.notebooks })
      } else {
        const contents = await this.getNotebookContents(this.props.historyState.noteId)
        this.setState({ notebookId: this.props.historyState.noteId, notebooks: contents.notebooks  })
      }
    }
  }

  getNotebookContents = async (notebookId) => {
    if (!notebookId) return this.props.notebooks

    try {
      const contents = await retrieveNotebook(notebookId, this.props.userId)
      return contents
    } catch (error) {
      console.log(error)
    }
  }

  handleMenuClick = (event, { name }) => {
    event.stopPropagation()
    const openModal = (name === 'Rename' || name === 'Move' || name === "Share")
    this.setState({ activeMenuItem: name, openModal })
  }

  closeModal = () => { this.setState({ activeMenuItem: null, openModal: false }) }

  handleChange = (event, { name, value }) => {
    const updatedItem = { ...this.state.item }
    updatedItem[name] = value

    this.setState({ item: updatedItem })
  }

  handleSave = async () => {
    try {
      if (this.state.item.notebookId) {
        await updateNotebook(this.state.item, this.props.userId)
      } else if (this.state.item.notepageId) {
        await updateNotepage(this.state.item, this.props.userId)
      }

      this.props.handleNoteChanges()
      this.setState({ openModal: false })
    } catch (error) {
      console.log(error)
    }
  }

  renderNotebookContents = (contents) => {
    if (!contents || !contents.length) {
      return (<List.Item> No available notebooks </List.Item>)
    }

    return contents.map((item) => {
      return (
        <List.Item key={item.notebookId}>
          <Image avatar src={notebookIcon} />
          <List.Content>
            <List.Header> { item.title } </List.Header>
          </List.Content>
        </List.Item>
      )
    })
  }

  renderModalContent = (activeMenuItem) => {
    if (activeMenuItem === 'Rename') {
      const label = (this.state.item.notebookId) ? 'Notebook' : 'Notepage'
      return (
        <Modal.Content>
          <Input name="title" value={this.state.item.title} onChange={this.handleChange} label={`${label} Title:`} />
        </Modal.Content>
      )
    } else if (activeMenuItem === 'Move') {
      return (
        <Modal.Content>
          <List divided relaxed>
            { this.renderNotebookContents(this.state.notebooks) }
          </List>
        </Modal.Content>
      )
    }

    return null
  }

  getPrevNotebook = () => {
    console.log(this.props.historyState)
  }

  render () {
    const style = {
      left: this.props.menuPosition && (this.props.menuPosition[0] - 20) + 'px',
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

        <Modal size="tiny" open={this.state.openModal} onClose={this.closeModal}>
          <Modal.Header> { this.state.activeMenuItem } </Modal.Header>
          { this.renderModalContent(this.state.activeMenuItem) }
          <Modal.Actions>
            { this.state.activeMenuItem === "Move" && this.props.contextMenuItem.parentNotebook && (
              <Button floated="left" compact icon="left arrow" basic onClick={this.getPrevNotebook} />
            )}
            <Button basic compact onClick={this.closeModal}> Cancel </Button>
            <Button color="green" compact onClick={this.handleSave}> Save </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    ) : null
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.signInData.userId,
    notebooks: state.notebooks.userNotebooks
  }
}

export default connect(mapStateToProps)(ContextMenu)