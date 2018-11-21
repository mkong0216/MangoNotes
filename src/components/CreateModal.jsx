import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Grid, Segment, Divider, Image, Header } from 'semantic-ui-react'
import FormModal from './FormModal'

import notebook from '../images/notebook.png'
import notepage from '../images/notepage.png'

class CreateModal extends React.Component {
  static propTypes = {
    toggleModal: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      showCreateForm: false,
      type: ''
    }
  }

  handleClick = (name) => { this.setState({ showCreateForm: true, type: name }) }

  closeFormModal = () => { this.setState({ showCreateForm: false, type: '' }) }

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
        <FormModal open={this.state.showCreateForm} closeModal={this.closeFormModal} type={this.state.type} />
      </React.Fragment>
    )
  }
}

export default CreateModal
