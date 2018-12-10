import React from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import UserSettings from './UserSettings'
import { signOutUser } from '../store/actions/user'
import { clearUserNotebooks } from '../store/actions/notebooks'
import { clearUserNotepages } from '../store/actions/notepages'

class UserMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  handleClick = (event, { name }) => { this.setState({ modalOpen: name }) }
  
  handleCloseModal = () => { this.setState({ modalOpen: false }) }

  handleSignOut = () => {
    this.props.signOutUser()
    this.props.clearUserNotebooks()
    this.props.clearUserNotepages()
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
            <Dropdown.Item name="settings" onClick={() => { this.setState({ modalOpen: true }) }}> User Settings </Dropdown.Item>
            <Dropdown.Item name="signout" onClick={this.handleSignOut}> Sign Out </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <UserSettings
          open={this.state.modalOpen}
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

function mapDispatchToProps (dispatch) {
  return {
    signOutUser: (...args) => { dispatch(signOutUser(...args)) },
    clearUserNotepages: (...args) => { dispatch(clearUserNotepages(...args)) },
    clearUserNotebooks: (...args) => { dispatch(clearUserNotebooks(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
