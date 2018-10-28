import React from 'react'
import { Modal, Grid, Segment, Divider, Image, Header, Input, Button } from 'semantic-ui-react'

import notebook from '../images/notebook.png'
import notepage from '../images/notepage.png'

class CreateModal extends React.Component {
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

export default CreateModal