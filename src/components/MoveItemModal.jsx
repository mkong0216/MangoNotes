import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Table, Image, Header, Label, Button } from 'semantic-ui-react'
import { moveNotebook, retrieveNotebook } from '../xhr/notebook'
import { moveNotepage } from '../xhr/notepage'
import { TYPE_NOTEBOOK, TYPE_NOTEPAGE } from '../utils'
import notebookIcon from '../images/notebook.png'

class MoveItemModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    noteItem: PropTypes.object,
    type: PropTypes.string,
    userId: PropTypes.string,
    handleNoteChanges: PropTypes.func.isRequired,
    parentNotebookId: PropTypes.string
  }

  constructor (props) {
    super (props)

    this.state = {
      contents: null,
      currNotebook: props.parentNotebookId,
      prevNotebook: null,

      selected: null
    }
  }

  componentDidMount () {
    this.setNotebookContents(this.state.currNotebook)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.currNotebook !== this.state.currNotebook) {
      this.setNotebookContents(this.state.currNotebook)
    }
  }

  setNotebookContents = async (notebookId) => {
    if (!notebookId) {
      this.setState({
        contents: this.props.userNotebooks,
        prevNotebook: undefined
      })
      return
    }

    try {
      const notebook = await retrieveNotebook(notebookId, this.props.userId)
      this.setState({
        contents: notebook.contents.notebooks,
        prevNotebook: notebook.parentNotebook
      })
      return
    } catch (error) {
      console.log(error)
    }
  }

  handleSelectNotebook = (id, title) => {
    const { notebookId, parentNotebook } = this.props.noteItem
    if (notebookId === id || parentNotebook === title) return

    this.setState({ selected: { id, title } })
  }

  handleMoveItem = async () => {
    if (!this.state.selected) return

    const { updatedAt, ...noteItem } = this.props.noteItem

    try {
      switch (this.props.type) {
        case TYPE_NOTEBOOK:
          await moveNotebook(this.state.selected, noteItem, this.props.userId)
          break
        case TYPE_NOTEPAGE:
          await moveNotepage(this.state.selected, noteItem, this.props.userId)
          break
        default:
          console.log("The note item is not a notebook or a notepage.")
          return
      }
    } catch (error) {
      console.log(error)
    }

    this.props.handleNoteChanges()
    this.props.closeModal()
  }

  renderNotebookContents = (contents) => {
    if (!contents || !contents.length) {
      return (
        <Table.Row disabled>
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
                { (this.props.noteItem.notebookId === item.notebookId) &&
                  <Label className="current-item">
                    Current notebook being moved
                  </Label>
                }
                { (this.props.noteItem.parentNotebook === item.title) &&
                  <Label className="current-item">
                    Already inside this notebook
                  </Label>
                }
              </Header.Content>
            </Header>
            { (this.props.noteItem.notebookId !== item.notebookId) &&
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

  render () {
    const PREV_NOTEBOOK_BUTTON = (typeof this.state.prevNotebook !== 'undefined') && (
      <Button
        floated="left"
        compact basic
        icon="left arrow"
        onClick={() => { this.setState({ currNotebook: this.state.prevNotebook }) }}
      />
    )

    return this.props.noteItem && (
      <Modal size="tiny" open={this.props.open} onClose={this.props.closeModal}>
        <Modal.Header> Move { this.props.noteItem.title } </Modal.Header>
        <Modal.Content>
          <Table compact selectable>
            <Table.Body>
              { this.renderNotebookContents(this.state.contents) }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          { PREV_NOTEBOOK_BUTTON }
          <Button basic compact onClick={this.props.closeModal}> Cancel </Button>
          <Button color="green" compact onClick={this.handleMoveItem}> Move Here </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

function mapStateToProps (state) {
  return {
    userNotebooks: state.notebooks.userNotebooks
  }
}

export default connect(mapStateToProps)(MoveItemModal)
