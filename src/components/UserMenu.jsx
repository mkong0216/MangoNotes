import React from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import UserSettings from './UserSettings'
import { signOutUser } from '../store/actions/user'

class UserMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  handleClick = (event, { name }) => { this.setState({ modalOpen: name }) }
  
  handleCloseModal = () => { this.setState({ modalOpen: false }) }

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
            <Dropdown.Item name="signout" onClick={this.props.signOutUser}> Sign Out </Dropdown.Item>
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
    signOutUser: (...args) => { dispatch(signOutUser(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
