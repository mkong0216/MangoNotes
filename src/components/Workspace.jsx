import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'
import CreateModal from './CreateModal'

import '../css/Workspace.css'
import plus from '../images/plus-icon.png'
import notebookIcon from '../images/notebook.png'

class Workspace extends React.Component {
  static propTypes = {
    updateCurrentPath: PropTypes.func.isRequired,
    currPath: PropTypes.array.isRequired,
    notebooks: PropTypes.array
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

  renderNotebooks = (notebooks) => {
    return notebooks.map((notebook, i) => {
      const { timestamp } = notebook
      const month = timestamp.getMonth() + 1
      const day = timestamp.getDate()
      const year = timestamp.getFullYear()

      const modifiedOn = `Last modified on ${month}/${day}/${year}`

      return (
        <Card
          key={i}
          image={notebookIcon}
          header={notebook.title}
          meta={modifiedOn}
        />
      )
    })
  }

  render () {
    const { currPath, notebooks } = this.props
    const currNotebook = currPath[currPath.length - 1]
    const notebooksToRender = notebooks.filter(notebook => notebook.parentNotebook === currNotebook)

    return (
      <React.Fragment>
        <Card.Group id="workspace" itemsPerRow={6}>
          { this.renderNotebooks(notebooksToRender) }
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
    notebooks: state.notebooks.userNotebooks
  }
}

export default connect(mapStateToProps)(Workspace)
