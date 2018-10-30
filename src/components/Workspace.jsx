import React from 'react'
import { connect } from 'react-redux'

import { Card } from 'semantic-ui-react'
import SidebarMenu from './SidebarMenu'
import CreateModal from './CreateModal'

import '../css/Workspace.css'
import plus from '../images/plus-icon.png'

class Workspace extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
      path: 'My Workspace'
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  updateCurrentPath = (activeMenu) => {
    this.setState({ path: activeMenu })
  }

  render () {
    return (
      <React.Fragment>
        <SidebarMenu updateCurrentPath={this.updateCurrentPath} />
        <Card.Group id="workspace" itemsPerRow={6}>
          <Card color="olive" image={plus} onClick={this.toggleModal} />
        </Card.Group>
        <CreateModal open={this.state.showModal} toggleModal={this.toggleModal} userId={this.props.userId} />
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.userId
  }
}

export default connect(mapStateToProps)(Workspace)