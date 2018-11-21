import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Divider, Icon, Header } from 'semantic-ui-react'
import { updateBrowserHistory } from '../utils'

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
    updateCurrentPath: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    const parsedURL = new URL(window.location.href)

    this.state = {
      activeMenuItem: 'workspace',
      username: parsedURL.pathname.slice(1)
    }
  }

  componentDidMount () {
    const newURL = `/${this.state.username}/${this.state.activeMenuItem}`
    updateBrowserHistory({ id: this.state.activeMenuItem }, newURL)
    this.props.updateCurrentPath([this.state.activeMenuItem], true)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activeMenuItem !== this.state.activeMenuItem) {
      const newURL = `/${this.state.username}/${this.state.activeMenuItem}`
      updateBrowserHistory({ id: this.state.activeMenuItem }, newURL)
      this.props.updateCurrentPath([this.state.activeMenuItem], true)
    }
  }

  handleMenuClick = (event, item) => { this.setState({ activeMenuItem: item.name }) }

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
