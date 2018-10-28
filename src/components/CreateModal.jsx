import React from 'react'
import { Modal, Grid, Segment, Divider, Image, Header } from 'semantic-ui-react'

import notebook from '../images/notebook.png'
import notepage from '../images/notepage.png'

class CreateModal extends React.Component {
  render () {
    return (
      <Modal dimmer="inverted" size="small" open={this.props.open} onClose={this.props.toggleModal}>
        <Modal.Header> Create a new notebook or notepage </Modal.Header>
        <Modal.Content image>
          <Segment secondary padded>
            <Grid columns={2} stackable textAlign='center'>
              <Divider vertical>Or</Divider>
              <Grid.Row verticalAlign='middle'>
                <Grid.Column>
                  <Image wrapped size='medium' src={notebook} />
                  <Header> Create notebook </Header>
                </Grid.Column>
                <Grid.Column>
                  <Image wrapped size='medium' src={notepage} />
                  <Header> Create notepage </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

export default CreateModal