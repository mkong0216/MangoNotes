import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'

import { Redirect } from 'react-router'
import { Segment, Form, Button, Message } from 'semantic-ui-react'

import '../css/SignInMenu.css'

import { createUserSignInData } from '../store/actions/user'

class SignInMenu extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    createUserSignInData: PropTypes.func.isRequired
  }

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
      const endpoint = '/' + submissionType

      axios.post(endpoint, {
        username: username,
        password: password
      })
      .then((response) => {
        this.props.createUserSignInData(username)
      })
      .catch((err) => {
        this.setState({
          errors: [err.response.data.error] || null
        })
      })
    }
  }

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

  handleChange = (event, { name, value }) => { this.setState({ [name] : value })}

  render () {
    const { username, password, errors } = this.state

    if (this.props.userId) {
      return (
        <Redirect to={`/${this.props.userId}`} />
      )
    } else {
      return (
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
}

function mapStateToProps (state) {
  return {
    userId: state.user.userId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createUserSignInData: (...args) => { dispatch(createUserSignInData(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInMenu)