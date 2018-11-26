import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Grid } from 'semantic-ui-react'
import Toolbar from './Toolbar'
import TextEditor from './TextEditor'
import NoteDetails from './NoteDetails'

import { retrieveNotepage, updateNotepage } from '../xhr/notepage'
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
      needsUpdate: false,
      saveContents: false
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

  saveNotepage = () => { this.setState({ saveContents: true })}

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
      saveContents: false,
      content: rawContent || this.state.content
    })

    updateNotepage(notepage, this.props.user.signInData.userId)
      .then((results) => {
        console.log(results)
      })
  }

  render () {
    return this.props.user.signedIn ? (
      <div className="notepage">
        <Grid celled padded columns={3}>
          <NoteDetails
            details={this.state.details}
            toggleEditTitle={this.toggleEditTitle}
            handleChange={this.handleChange}
            saveNotepage={this.saveNotepage}
          />
          <Grid.Row>
            <Grid.Column width={3}>
              <Toolbar />
            </Grid.Column>
            <Grid.Column width={10}>
              <TextEditor
                updateNotepage={this.handleNotepageChange}
                content={this.state.content}
                saveContents={this.state.saveContents}
              />
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