import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Modal, Grid, Segment, Divider, Image, Header, Input, Button } from 'semantic-ui-react'

import { createNewNotebook } from '../store/actions/notebooks'

import notebook from '../images/notebook.png'
import notepage from '../images/notepage.png'

class CreateModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    userId: PropTypes.string,
    updateCurrentPath: PropTypes.func.isRequired,
    currPath: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      type: '',
      title: '',
      showNextModal: false,
    }
  }

  handleClick = (name) => { this.setState({ type: name, showNextModal: true }) }

  handleChange = (event, { value }) => { this.setState({ title: value }) }

  handleCreate = (event) => {
    // TODO - POST request to DB
    const { currPath } = this.props
  
    const title = this.state.title || ('Untitled ' + this.state.type)
    const prevIndex = currPath.length - 1

    const path = [
      ...currPath,
      { name: title, type: this.state.type }
    ]

    this.props.updateCurrentPath(path)

    // Storing new notebook in Redux
    if (this.state.type === 'notebook') {
      const newNotebook = {
        title,
        creator: this.props.userId,
        parentNotebook: currPath[prevIndex].name
      }
  
      this.props.createNewNotebook(newNotebook)
    }

    // Closing modals
    this.props.toggleModal()
    this.closeSecondModal()
  }

  closeSecondModal = () => {
    this.setState({
      type: '',
      title: '',
      showNextModal: false
    })
  }

  renderNextModal = () => {
    return (
      <Modal open={this.state.showNextModal} onClose={this.closeSecondModal} size="tiny">
        <Modal.Header> Creating a new {this.state.type} </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="Name"
            placeholder={`Untitled ${this.state.type}`}
            value={this.state.title}
            onChange={this.handleChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic compact onClick={this.closeSecondModal}> Cancel </Button>
          <Button color="green" compact onClick={this.handleCreate}> Create </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    return (
      <React.Fragment>
        <Modal dimmer="inverted" size="small" open={this.props.open} onClose={this.props.toggleModal}>
          <Modal.Header> Create a new notebook or notepage </Modal.Header>
          <Modal.Content image>
            <Segment secondary padded>
              <Grid columns={2} stackable textAlign='center'>
                <Divider vertical>Or</Divider>
                <Grid.Row verticalAlign='middle'>
                  <Grid.Column name="notebook" onClick={() => { this.handleClick('notebook') }}>
                    <Image wrapped size='medium' src={notebook} />
                    <Header> Create notebook </Header>
                  </Grid.Column>
                  <Grid.Column name="notepage" onClick={() => { this.handleClick('notepage') }}>
                    <Image wrapped size='medium' src={notepage} />
                    <Header> Create notepage </Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Modal.Content>
        </Modal>
        { this.renderNextModal() }
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.userId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createNewNotebook: (...args) => { dispatch(createNewNotebook(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal)