import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Button } from 'semantic-ui-react'

class FormModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      title: ''
    }
  }

  handleChange = (event, { value }) => { this.setState({ title: value }) }

  render () {
    return (
      <Modal open={this.props.open} onClose={this.props.closeModal} size="tiny">
        <Modal.Header> Creating a new {this.props.type} </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="Name"
            placeholder={`Untitled ${this.props.type}`}
            value={this.state.title}
            onChange={this.handleChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic compact onClick={this.props.closeModal}> Cancel </Button>
          <Button color="green" compact onClick={this.handleCreate}> Create </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default FormModal
