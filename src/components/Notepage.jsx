import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Grid, Button } from 'semantic-ui-react'
import NoteDetails from './NoteDetails'
import UserMenu from './UserMenu'
import TextEditor from './TextEditor'
import ShareModal from './ShareModal'
import { retrieveNotepage } from '../xhr/notepage'
import { addToUserShared } from '../xhr/user'
import '../css/Notepage.css'

class Notepage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      error: false,
      notepage: null,
      saveContents: false,
      openModal: false
    }
  }

  async componentDidMount () {
    const { noteId, permissions } = this.props.match.params
    const userId = (permissions || this.props.userId)

    try {
      const notepage = await retrieveNotepage(noteId, userId)
      if (permissions && this.props.userId) {
        await addToUserShared(this.props.userId, noteId)
      }

      notepage.notepageId = noteId

      this.setState({
        notepage,
        isLoading: false,
        error: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ error: error.message })
    }
  }

  toggleSaveContents = () => { this.setState({ saveContents: !this.state.saveContents }) }

  toggleShareModal = () => { this.setState({ openModal: !this.state.openModal }) }

  render () {
    if (this.state.isLoading) return null

    const { permissions } = this.props.match.params
    const userId = (permissions || this.props.userId)
    const { content, ...details } = this.state.notepage

    const shared = !(!permissions)
    const readOnly = (shared) ? (permissions[0] === '0') : false

    return this.props.userId ? (
      <div className="notepage">
        <Grid padded columns={3}>
          <NoteDetails details={details} userId={userId} shared={shared} />
          <div className="user-actions">
            <Button
              className="share"
              icon="share"
              content="Share"
              compact
              color="yellow"
              labelPosition="left"
              onClick={this.toggleShareModal}
            />
            <Button
              className="save"
              icon="save"
              content="Save"
              compact primary
              labelPosition="left"
              onClick={this.toggleSaveContents}
            />
            <UserMenu />
          </div>
          <ShareModal
            open={this.state.openModal}
            noteItem={this.state.notepage}
            closeModal={this.toggleShareModal}
          />
          <TextEditor
            content={content}
            details={details}
            userId={userId}
            saveContents={this.state.saveContents}
            toggleSaveContents={this.toggleSaveContents}
            readOnly={readOnly}
          />
        </Grid>
      </div>
    ) : <Redirect to="/" />
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.signInData && state.user.signInData.userId
  }
}

export default connect(mapStateToProps)(Notepage)
