import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Popup, Image, Input, Button, Icon } from 'semantic-ui-react'
// import { starNotepage } from '../xhr/notepage'
import notepageIcon from '../images/notepage.png'

class NoteDetails extends React.PureComponent {
  static propTypes = {
    details: PropTypes.object,
    toggleEditTitle: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    historyState: PropTypes.object,
    userId: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      starIcon: 'star outline',
      starred: false
    }
  }

  handleStarClick = (event) => {
    const starIcon = (!this.state.starred) ? 'star' : 'star outline'
    this.setState({ starIcon, starred: !this.state.starred })
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
                onClick={this.props.toggleEditTitle}
                onBlur={this.props.toggleEditTitle}
                onChange={this.props.handleChange}
              />
            )}
            content="Rename"
            size="tiny"
            inverted
            on="hover"
          />
          <Icon className="starred" name={this.state.starIcon} link onClick={this.handleStarClick} color="yellow" size="tiny" />
          <span className="timestamp">
            Last edited on { this.props.details && this.props.details.updatedAt }
          </span>
        </Header> 
        <Button
          className="save"
          icon="save"
          content="Save"
          onClick={this.props.saveNotepage}
          compact primary
        />
      </Grid.Row>
    )
  }
}

export default NoteDetails