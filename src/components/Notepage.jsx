import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import NoteDetails from './NoteDetails'
import { retrieveNotepage } from '../xhr/notepage'
import '../css/Notepage.css'

class Notepage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      error: false,
      notepage: null
    }
  }

  async componentDidMount () {
    const { noteId, permissions } = this.props.match.params
    const userId = (permissions || this.props.userId)

    try {
      const notepage = await retrieveNotepage(noteId, userId)
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

  render () {
    if (this.state.isLoading) return null

    const { permissions } = this.props.match.params
    const userId = (permissions || this.props.userId)
    const { content, ...details } = this.state.notepage

    let shared = !(!permissions)

    return (
      <div className="notepage">
        <Grid celled padded columns={3}>
          <NoteDetails details={details} userId={userId} shared={shared} />
          <Grid.Row>
            <Grid.Column width={4}>
              Toolbar
            </Grid.Column>
            <Grid.Column width={12}>
              Text Editor
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.signInData && state.user.signInData.userId
  }
}

export default connect(mapStateToProps)(Notepage)
