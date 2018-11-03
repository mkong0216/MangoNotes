import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'

import '../css/Workspace.css'
import plus from '../images/plus-icon.png'

class Workspace extends React.Component {
  static propTypes = {
    updateCurrentPath: PropTypes.func.isRequired,
    currPath: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  render () {
    return (
      <React.Fragment>
        <Card.Group id="workspace" itemsPerRow={6}>
          <Card color="olive" image={plus} onClick={this.toggleModal} />
        </Card.Group>
        <CreateModal
          open={this.state.showModal}
          toggleModal={this.toggleModal}
          updateCurrentPath={this.props.updateCurrentPath}
          currPath={this.props.currPath}
        />
      </React.Fragment>
    )
  }
}

export default Workspace
