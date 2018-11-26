import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid, Header, Image, Popup, Input } from 'semantic-ui-react'
import Toolbar from './Toolbar'
import TextEditor from './TextEditor'

import { retrieveNotepage, updateNotepage } from '../xhr/notepage'
import notepageIcon from '../images/notepage.png'
import '../css/Notepage.css'


class Notepage extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      details: null,
      content: '',
      notepageId: this.props.location.state.noteId,
      editing: false,
      needsUpdate: false
    }
  }

  async componentDidMount () {
    if (!this.props.user.signedIn) return

    try {
      const { content, ...details } = await retrieveNotepage(this.state.notepageId, this.props.user.signInData.userId)
      const timestamp = new Date(details.updatedAt)
      details.updatedAt = timestamp.toUTCString()

      this.setState({ details, content })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.state.editing && this.state.needsUpdate) {
      this.handleNotepageChange()
    }
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      details: {
        ...this.state.details,
        [name]: value
      },
      needsUpdate: true
    })
  }

  toggleEditTitle = () => {
    this.setState({ editing: !this.state.editing })
  }

  handleNotepageChange = (rawContent) => {
    const notepage = {
      title: this.state.details.title,
      parentNotebook: this.state.details.parentNotebook,
      notepageId: this.state.notepageId,
      content: rawContent || this.state.content
    }

    this.setState({
      needsUpdate: false,
      content: rawContent || this.state.content
    })

    updateNotepage(notepage, this.props.user.signInData.userId)
  }

  render () {
    return this.props.user.signedIn ? (
      <div className="notepage">
        <Grid celled padded columns={3}>
          <Grid.Row className="notepage-details" stretched>
            <Header>
              <Image src={notepageIcon} />
              <Popup
                trigger={(
                  <Input
                    className="title"
                    name="title"
                    transparent
                    defaultValue={this.state.details && this.state.details.title}
                    onClick={this.toggleEditTitle}
                    onBlur={this.toggleEditTitle}
                    onChange={this.handleChange}
                  />
                )}
                content="Rename"
                size="tiny"
                inverted
                on="hover"
              />
              <span className="timestamp">
                Last edited on { this.state.details && this.state.details.updatedAt }
              </span>
            </Header> 
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <Toolbar />
            </Grid.Column>
            <Grid.Column width={10}>
              <TextEditor updateNotepage={this.handleNotepageChange} content={this.state.content} />
            </Grid.Column>
            <Grid.Column width={3}>
              Search Bar
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    ) : (
      <Redirect to="/" />
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Notepage)