import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'
import { getDateModified } from '../utils'

import '../css/Workspace.css'
import plus from '../images/plus-icon.png'
import notebookIcon from '../images/notebook.png'
import notepageIcon from '../images/notepage.png'

class Workspace extends React.Component {
  static propTypes = {
    updateCurrentPath: PropTypes.func.isRequired,
    currPath: PropTypes.array.isRequired,
    notebooks: PropTypes.array,
    notepages: PropTypes.array
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

  renderWorkspaceItems = (currNotebook, items, type) => {
    if (!items) return null

    const itemsToRender = items.filter(item => item.parentNotebook === currNotebook)

    return itemsToRender.map((item, i) => {
      const dateModified = getDateModified(item.timestamp)
      const modifiedOn = `Last modified on ${dateModified}`
      const path = [
        ...this.props.currPath,
        { name: item.title, type }
      ]

      return (
        <Card
          key={i}
          image={(type === 'notebook') ? notebookIcon : notepageIcon}
          header={item.title}
          meta={modifiedOn}
          onClick={() => { this.props.updateCurrentPath(path) }}
        />
      )
    })
  }

  render () {
    const { currPath, notebooks, notepages } = this.props
    const currNotebook = currPath[currPath.length - 1].name
  
    return (
      <React.Fragment>
        <Card.Group id="workspace" itemsPerRow={6}>
          { this.renderWorkspaceItems(currNotebook, notebooks, 'notebook') }
          { this.renderWorkspaceItems(currNotebook, notepages, 'notepage')}
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

function mapStateToProps (state) {
  return {
    notebooks: state.notebooks.userNotebooks,
    notepages: state.notepages.userNotePages
  }
}

export default connect(mapStateToProps)(Workspace)
