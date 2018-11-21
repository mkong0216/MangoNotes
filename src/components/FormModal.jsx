import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Input, Button, Message } from 'semantic-ui-react'
import { createNewNotebook } from '../xhr/notebook'

class FormModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    closeAllModals: PropTypes.func.isRequired,
    parentNotebook: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      title: '',
      error: null
    }
  }

  handleChange = (event, { value }) => { this.setState({ title: value, error: null }) }

  handleCreate = (event) => {
    const info = {
      title: this.state.title,
      creator: this.props.userId,
      parentNotebook: this.props.parentNotebook
    }

    createNewNotebook(info)
      .then(() => { this.props.closeAllModals() })
      .catch((error) => {
        this.setState({
          error: error.message
        })
      })
  }

  render () {
    const errorMessage = this.state.error ? (
      <Message error compact size="small" header={this.state.error} />
    ) : null

    return (
      <Modal open={this.props.open} onClose={this.props.closeModal} size="tiny">
        <Modal.Header> Creating a new {this.props.type} </Modal.Header>
        <Modal.Content>
          { errorMessage }
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

function mapStateToProps (state) {
  return {
    userId: state.user.signInData.userId
  }
}

export default connect(mapStateToProps)(FormModal)
