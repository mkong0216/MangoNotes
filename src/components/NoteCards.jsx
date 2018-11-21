import React from 'react'
import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'
import plus from '../images/plus-icon.png'
import '../css/NoteCards.css'

/**
 * NoteCards.jsx
 *
 * Displays Notebook and Notepage information in card form.
 */

class NoteCards extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  renderNoteCards = (items) => {
    return items.map((item, i) => {
      return (
        <Card key={i} />
      )
    })
  }

  render () {
    return (
      <React.Fragment>
        <Card.Group className="notecards" itemsPerRow={4}>
          <Card color="olive" image={plus} link onClick={this.toggleModal} />
          { this.renderNoteCards(this.props.items) }
        </Card.Group>
        <CreateModal open={this.state.showModal} toggleModal={this.toggleModal} />
      </React.Fragment>
    )
  }
}

export default NoteCards