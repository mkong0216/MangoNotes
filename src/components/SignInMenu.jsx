import React from 'react'
import axios from 'axios'
import { Segment, Form, Button, Message } from 'semantic-ui-react'
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

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.errors && this.state.errors) {
      console.log('here')
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

export default SignInMenu