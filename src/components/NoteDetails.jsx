import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Image, Icon, Popup, Button, Input } from 'semantic-ui-react'
import { updateNotepage } from '../xhr/notepage'
import notepageIcon from '../images/notepage.png'

class NoteDetails extends React.Component {
  static propTypes = {
    details: PropTypes.object,
    userId: PropTypes.string,
    shared: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      starIcon: (props.details.starred) ? 'star' : 'star outline',
      starred: (props.details.starred),
      title: ''
    }
  }

  handleStarClick = async () => {
    const starIcon = (!this.state.starred) ? 'star' : 'star outline'

    const { updatedAt, ...notepage } = this.props.details
    notepage.starred = !this.state.starred

    this.setState({ starIcon, starred: notepage.starred })
    await updateNotepage(notepage, this.props.userId)
  }

  handleChange = (event, { value }) => { this.setState({ title: value }) }

  handleTitleChange = async () => {
    if (this.props.details.title !== this.state.title) {
      const { updatedAt, ...notepage } = this.props.details
      notepage.title = this.state.title
      await updateNotepage(notepage, this.props.userId)
    }
  }

  render () {
    return (
      <Grid.Row className="notepage-details" stretched>
        <Header>
          <Image src={notepageIcon} />
          <Popup
            trigger={(
              <Input
                className="title"
                name="title"
                transparent
                defaultValue={this.props.details && this.props.details.title}
                onChange={this.handleChange}
                onBlur={this.handleTitleChange}
                disabled={this.props.shared}
              />
            )}
            content="Rename"
            size="tiny"
            inverted
            on="hover"
          />
          <Icon className="starred" name={this.state.starIcon} onClick={this.handleStarClick} link color="yellow" size="tiny" />
          <span className="timestamp">
            Last edited on { this.props.details && this.props.details.updatedAt }
          </span>
        </Header> 
        <Button
          className="save"
          icon="save"
          content="Save"
          compact primary
        />
      </Grid.Row>
    )
  }
}

export default NoteDetails
