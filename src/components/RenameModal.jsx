import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Button } from 'semantic-ui-react'
import { updateNotepage } from '../xhr/notepage'
import { updateNotebook } from '../xhr/notebook'
import { TYPE_NOTEBOOK, TYPE_NOTEPAGE } from '../utils'

class RenameModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    noteItem: PropTypes.object,
    userId: PropTypes.string,
    handleNoteChanges: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      title: props.noteItem.title
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.open && !this.props.open) {
      this.setState({ title: this.props.noteItem.title })
    }
  }

  handleChange = (event, { name, value }) => { this.setState({ [name]: value }) }

  handleSave = async () => {
    const noteItem = { ...this.props.noteItem }
    noteItem.title = this.state.title

    try {
      switch (this.props.type) {
        case TYPE_NOTEBOOK:
          await updateNotebook(noteItem, this.props.userId, false)
          break
        case TYPE_NOTEPAGE: 
          await updateNotepage(noteItem, this.props.userId)
          break
        default:
          console.log('The note item is not a notebook or a notepage.')
          break
      }
    } catch (error) {
      console.log(error)
    }

    this.props.handleNoteChanges()
    this.props.closeModal()
  }

  render () {
    const label = (this.props.type === 'notebook') ? 'Notebook' : 'Notepage'

    return this.props.noteItem && (
      <Modal size="tiny" open={this.props.open} onClose={this.props.closeModal}>
        <Modal.Header> Rename { this.props.noteItem.title } </Modal.Header>
        <Modal.Content>
          <Input name="title" value={this.state.title} onChange={this.handleChange} fluid label={`${label} Title:`} />
        </Modal.Content>
        <Modal.Actions>
          <Button basic compact onClick={this.props.closeModal}> Cancel </Button>
          <Button color="green" compact onClick={this.handleSave}> Save </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default RenameModal
