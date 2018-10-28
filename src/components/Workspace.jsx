import React from 'react'
import { connect } from 'react-redux'

import { Menu, Icon, Header, Divider, Card, Modal, Image, Segment, Grid } from 'semantic-ui-react'

import '../css/Workspace.css'
import plus from '../images/plus-icon.png'
import notebook from '../images/notebook.png'
import notepage from '../images/notepage.png'

class Workspace extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeMenuItem: 'workspace',
      workspaceItems: [
        { title: 'new' }
      ],
      showModal: false
    }
  }

  handleMenuClick = (event, name) => {
    this.setState({ activeMenuItem: name })
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  renderMenuList = (items) => {
    return items.map((item, i) => {
      return (
        <Menu.Item
          name={item.name}
          key={i}
          active={(this.state.activeMenuItem === item.name)}
          onClick={(event) => { this.handleMenuClick(event, item.name) }}
        >
          <Icon name={item.icon} />
          { item.title }
        </Menu.Item>
      )
    })
  }

  renderItems = () => {
    const { workspaceItems } = this.state

    return workspaceItems.map((item, i) => {
      return (
        <Card key={i}color="yellow" image={plus} />
      )
    })
  }

  render () {
    const items = [
      { "title": 'My Workspace', "name": 'workspace', "icon": 'write' },
      { "title": 'Shared with me', "name": 'shared', "icon": 'users' },
      { "title": 'Recent', "name": 'recent', "icon": 'clock' },
      { "title": 'Starred', "name": 'starred', "icon": 'star' },
      { "title": 'Trash', "name": 'trash', "icon": 'trash alternate' }
    ]

    return (
      <React.Fragment>
        <Menu icon="labeled" vertical pointing fixed="left">
          <Menu.Item header> 
            <Header as="h2"> MangoNotes </Header>
            <Divider hidden />
          </Menu.Item>
          { this.renderMenuList(items) }
        </Menu>
        <Card.Group id="workspace" itemsPerRow={6}>
          <Card color="olive" image={plus} onClick={this.toggleModal} />
        </Card.Group>
        <Modal dimmer="inverted" size="small" open={this.state.showModal} onClose={this.toggleModal}>
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
            {/* <Segment.Group horizontal>
              <Segment secondary>
                <Label attached='bottom' size='large'> Create new notebook </Label>
                <Image wrapped size='medium' src={notebook} />
              </Segment>
              <Segment secondary>
                <Label attached='bottom' size='large'> Create new notepage </Label>
                <Image wrapped size='medium' src={notepage} />
              </Segment>
            </Segment.Group> */}
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.userId
  }
}

export default connect(mapStateToProps)(Workspace)