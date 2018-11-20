import React from 'react'
import { connect } from 'react-redux'
import { Segment, Form, Button, Message } from 'semantic-ui-react'
import { authenticateUser } from '../xhr/user';
import { createUserSignInData } from '../store/actions/user'

import '../css/SignInMenu.css'

class SignInMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      errors: null
    }
  }

  handleSubmit = (event) => {
    const { username, password } = this.state

    event.preventDefault()

    const errors = []
    if ( !username || !password) {
      errors.push("Some required fields appear to be missing.")
    }

    if (errors.length) {
      this.setState({
        username: '',
        passsword: '',
        errors
      })
    } else {
      const submissionType = event.target.name
      const credentials = {
        username,
        password
      }

      authenticateUser(credentials, submissionType)
        .then((signedIn) => {
          console.log(signedIn)
          this.props.createUserSignInData(signedIn)
        })
        .catch((error) => {
          this.setState({
            username: '',
            password: '',
            errors: [error.message] || null
          })
        })

    }
  }

  handleChange = (event, { name, value }) => { this.setState({ [name] : value })}

  renderErrorMessages = (errors) => {
    if (errors && errors.length) {
      return (
        <Message
          error
          compact
          size="small"
          header="Oops! Some errors occurred while attempting to log you in."
          list={errors}
        />
      )
    } else {
      return null
    }
  }

  render () {
    const { username, password, errors } = this.state

    return this.props.(
      <div className="sign-in">
        <Segment className="dialog">
          <div className="brand"> 
            <div className="logo" />
            MangoNotes 
          </div>
          { this.renderErrorMessages(errors) }
          <Form>
            <Form.Input
              placeholder="Username"
              label="Username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Password'
              label="Password"
              name='password'
              type='password'
              value={password}
              onChange={this.handleChange}
            />
            <Button.Group size='large' fluid>
              <Button className="login" name="login" onClick={this.handleSubmit}> Log In </Button>
              <Button.Or />
              <Button className="register" name="register" onClick={this.handleSubmit}> Register </Button>
            </Button.Group>
          </Form>
        </Segment>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userData: state.user.signInData
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createUserSignInData: (...args) => { dispatch(createUserSignInData(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInMenu)