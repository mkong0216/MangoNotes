import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Divider, Icon, Header } from 'semantic-ui-react'

const MENU_ITEMS = [
  { "title": 'My Workspace', "name": 'workspace', "icon": 'write' },
  { "title": 'Shared with me', "name": 'shared', "icon": 'users' },
  { "title": 'Recent', "name": 'recent', "icon": 'clock' },
  { "title": 'Starred', "name": 'starred', "icon": 'star' },
  { "title": 'Trash', "name": 'trash', "icon": 'trash alternate' }
]

/**
 * SideBarMenu.jsx
 * 
 * Controls navigation across user's notebooks and notepages.
 */

class SidebarMenu extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    const parsedURL = new URL(window.location.href)

    this.state = {
      activeMenuItem: 'workspace',
      username: parsedURL.pathname.slice(1)
    }
  }

  handleMenuClick = (event, item) => {
    this.setState({ activeMenuItem: item.name })
    const historyState = this.props.history.location.state

    const path = `/${historyState.user}/dashboard/${item.name}`
    const state = {
      id: item.name,
      currentPath: [item.name],
      user: historyState.user
    }

    this.props.history.push({ pathname: path, state })
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
