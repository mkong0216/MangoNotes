import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Modal, Input, Button, Image, Label, Table, Header } from 'semantic-ui-react'
import { updateNotebook, retrieveNotebook, moveNotebook } from '../xhr/notebook'
import { moveNotepage } from '../xhr/notepage'
import { updateNotepage } from '../xhr/notepage'
import notebookIcon from '../images/notebook.png'
import '../css/ContextMenu.css'

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

      currNotebook: null,
      prevNotebook: null,
      contents: null,
      selected: null
    }
  }

  async componentDidUpdate (prevProps, prevState) {
    if (!prevProps.showMenu && this.props.showMenu) {
      const { historyState } = this.props
      const currNotebook = historyState.type === 'notebook' && historyState.noteId

      this.setState({
        item: this.props.contextMenuItem,
        notebooks: this.props.notebooks,
        currNotebook
      })
    } else if (prevState.currNotebook !== this.state.currNotebook) {
      const { currNotebook } = this.state
      const notebook = await this.getNotebookContents(currNotebook)
      this.setState({ ...notebook })
    }
  }

  getNotebookContents = async (notebookId) => {
    if (!notebookId) {
      return {
        contents: this.props.userNotebooks,
        prevNotebook: undefined
      }
    }

    try {
      const notebook = await retrieveNotebook(notebookId, this.props.userId)
      return {
        contents: notebook.contents.notebooks,
        prevNotebook: notebook.parentNotebook
      }
    } catch (error) {
      console.log(error)
    }
  }

  getPrevNotebook = () => { this.setState({ currNotebook: this.state.prevNotebook }) }

  handleMenuClick = (event, { name }) => {
    event.stopPropagation()
    const openModal = (name === 'Rename' || name === 'Move' || name === "Share")
    this.setState({ activeMenuItem: name, openModal })
  }

  closeModal = () => { this.setState({ activeMenuItem: null, openModal: false, selected: null }) }

  handleChange = (event, { name, value }) => {
    const updatedItem = { ...this.state.item }
    updatedItem[name] = value

    this.setState({ item: updatedItem })
  }

  handleSave = async () => {
    try {
      const { item } = this.state
      if (this.state.activeMenuItem === 'Rename') {
        (this.state.item.notebookId) ? await updateNotebook(item.notebookId, this.props.userId) : await updateNotepage(item.notepageId, this.props.userId)
      } else if (this.state.activeMenuItem === 'Move' && this.state.selected) {
        const { updatedAt, ...noteItem } = this.state.item
        if (item.notebookId) {
          await moveNotebook(this.state.selected, noteItem, this.props.userId)
        } else if (item.notepageId) {
          await moveNotepage(this.state.selected, noteItem, this.props.userId)
        }
      }

      this.props.handleNoteChanges()
      this.setState({ openModal: false })
    } catch (error) {
      console.log(error)
    }
  }

  handleSelectNotebook = (id, title) => {
    const { notebookId, parentNotebook } = this.props.contextMenuItem
    if (id === notebookId || parentNotebook === title) return

    this.setState({ selected: { id, title } })
  }

  renderNotebookContents = (contents) => {
    if (!contents || !contents.length) {
      return (
        <Table.Row>
          <Table.Cell> No available notebooks. </Table.Cell>
        </Table.Row>
      )
    }

    return contents.map((item) => {
      return (
        <Table.Row
          key={item.notebookId}
          active={(this.state.selected && this.state.selected.id === item.notebookId)}
          onClick={() => { this.handleSelectNotebook(item.notebookId, item.title) }}
        >
          <Table.Cell>
            <Header as='h4' image>
              <Image src={notebookIcon} />
              <Header.Content>
                { item.title }
                { (this.props.contextMenuItem.notebookId === item.notebookId) &&
                  <Label className="current-item">
                    Current notebook being moved
                  </Label>
                }
                { (this.props.contextMenuItem.parentNotebook === item.title) &&
                  <Label className="current-item">
                    Already inside this notebook
                  </Label>
                }
              </Header.Content>
            </Header>
            { (this.props.contextMenuItem.notebookId !== item.notebookId) &&
              <Button
                icon="chevron right"
                floated="right"
                compact
                size="small"
                onClick={() => { this.setState({ currNotebook: item.notebookId }) }}
              />
            }
          </Table.Cell>
        </Table.Row>
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
          <Table compact selectable>
            <Table.Body>
              { this.renderNotebookContents(this.state.contents) }
            </Table.Body>
          </Table>
        </Modal.Content>
      )
    }

    return null
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
            { this.state.activeMenuItem === "Move" && typeof this.state.prevNotebook !== 'undefined' && (
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
    userNotebooks: state.notebooks.userNotebooks
  }
}

export default connect(mapStateToProps)(ContextMenu)