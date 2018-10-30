import React from 'react'
import { Menu, Divider, Icon, Header } from 'semantic-ui-react'

const MENU_ITEMS = [
  { "title": 'My Workspace', "name": 'workspace', "icon": 'write' },
  { "title": 'Shared with me', "name": 'shared', "icon": 'users' },
  { "title": 'Recent', "name": 'recent', "icon": 'clock' },
  { "title": 'Starred', "name": 'starred', "icon": 'star' },
  { "title": 'Trash', "name": 'trash', "icon": 'trash alternate' }
]

class SidebarMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeMenuItem: 'workspace'
    }
  }

  handleMenuClick = (event, item) => {
    this.setState({ activeMenuItem: item.name })
    this.props.updateCurrentPath(item.title)
  }

  renderMenuList = (items) => {
    return items.map((item, i) => {
      return (
        <Menu.Item
            name={item.name}
            key={i}
            active={(this.state.activeMenuItem === item.name)}
            onClick={(event) => { this.handleMenuClick(event, item) }}
        >
          <Icon name={item.icon} />
          { item.title }
        </Menu.Item>
      )
    })
  }

  render() {
    return (
      <Menu icon="labeled" vertical pointing fixed="left">
        <Menu.Item header> 
          <Header as="h2"> MangoNotes </Header>
          <Divider hidden />
        </Menu.Item>
        { this.renderMenuList(MENU_ITEMS) }
      </Menu>
    )
  }
}

export default SidebarMenu