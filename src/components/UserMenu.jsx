import React from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import UserSettings from './UserSettings'

const USER_MENU = [
  { key: 'account', text: 'User Account', value: 'User Account', content: 'User Account' },
  { key: 'settings', text: 'User Settings', value: 'User Settings', content: 'User Settings' }
]

class UserMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  handleClick = (event, { name }) => { this.setState({ modalOpen: name }) }
  
  handleCloseModal = () => { this.setState({ modalOpen: false })}

  renderMenuItems = (menuItems) => {
    return menuItems.map((item) => {
      return (
        <Dropdown.Item
          key={item.key}
          name={item.key}
          onClick={this.handleClick}
        >
          { item.text }
        </Dropdown.Item> 
      )
    })
  }

  render () {
    return (
      <React.Fragment>
        <Dropdown
          text='User'
          icon='user'
          compact floating labeled button
          className='icon user-account'
        >
          <Dropdown.Menu>
            { this.renderMenuItems(USER_MENU) }
          </Dropdown.Menu>
        </Dropdown>
        <UserSettings
          open={(this.state.modalOpen === 'settings')}
          closeModal={this.handleCloseModal}
          username={this.props.username}
        />
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    username: state.user.signInData.username
  }
}

export default connect(mapStateToProps)(UserMenu)
