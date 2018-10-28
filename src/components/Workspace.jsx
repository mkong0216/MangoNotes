import React from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Header, Divider } from 'semantic-ui-react'

import '../css/Workspace.css'

class Workspace extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeItem: 'workspace'
    }
  }

  componentDidMount () {
    const endpoint = `/${this.props.userId}/${this.state.activeItem}`
  }

  handleItemClick = (event, name) => {
    this.setState({ activeItem: name })
  }

  renderMenuList = (items) => {
    return items.map((item, i) => {
      return (
        <Menu.Item
          name={item.name}
          key={i}
          active={(this.state.activeItem === item.name)}
          onClick={(event) => { this.handleItemClick(event, item.name) }}
        >
          <Icon name={item.icon} />
          { item.title }
        </Menu.Item>
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
      <div>
        <Menu icon="labeled" vertical pointing fixed="left">
          <Menu.Item header> 
            <Header as="h2"> MangoNotes </Header>
            <Divider hidden />
          </Menu.Item>
          { this.renderMenuList(items) }
        </Menu>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.userId
  }
}

export default connect(mapStateToProps)(Workspace)