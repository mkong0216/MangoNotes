import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Popup, Image, Input } from 'semantic-ui-react'
import notepageIcon from '../images/notepage.png'

class NoteDetails extends React.PureComponent {
  static propTypes = {
    details: PropTypes.object,
    toggleEditTitle: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired
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
          <span className="timestamp">
            Last edited on { this.props.details && this.props.details.updatedAt }
          </span>
        </Header> 
      </Grid.Row>
    )
  }
}

export default NoteDetails