import React from 'react'
import { connect } from 'react-redux'
import { Menu, Modal, Input, Button } from 'semantic-ui-react'
import { updateNotebook } from '../xhr/notebook'

class ContextMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeMenuItem: null,
      openModal: false,
      item: null
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.showMenu && this.props.showMenu) {
      this.setState({ item: this.props.contextMenuItem })
    }
  }

  handleMenuClick = (event, { name }) => {
    event.stopPropagation()
    const openModal = (name === 'Rename' || name === 'Move' || name === "Share")
    this.setState({ activeMenuItem: name, openModal })
  }

  closeModal = () => { this.setState({ activeMenuItem: null, openModal: false }) }

  handleChange = (event, { name, value }) => {
    const updatedItem = { ...this.state.item }
    updatedItem[name] = value

    this.setState({ item: updatedItem })
  }

  handleSave = () => {
    if (this.state.item.notebookId) {
      updateNotebook(this.state.item, this.props.userId)
    }
  }

  renderModalContent = (activeMenuItem) => {
    if (activeMenuItem === 'Rename') {
      const label = (this.state.item.notebookId) ? 'Notebook' : 'Notepage'
      return (
        <Modal.Content>
          <Input name="title" value={this.state.item.title} onChange={this.handleChange} label={`${label} Title:`} />
        </Modal.Content>
      )
    } else {
      return null
    }
  }

  render () {
    const style = {
      left: this.props.menuPosition && (this.props.menuPosition[0] - 20) + 'px',
      top: this.props.menuPosition && this.props.menuPosition[1] + 'px'
    }

    return (this.props.contextMenuItem) ? (
      <React.Fragment>
        { this.props.showMenu && (
          <Menu pointing vertical compact className="context-menu" style={style}>
            <Menu.Item name="Rename" link onClick={this.handleMenuClick}> Rename </Menu.Item>
            <Menu.Item name="Remove" link onClick={this.handleMenuClick}> Remove </Menu.Item>
            <Menu.Item name="Starred" link onClick={this.handleMenuClick}> Add to starred </Menu.Item>
            <Menu.Item name="Share" link onClick={this.handleMenuClick}> Share </Menu.Item>
            <Menu.Item name="Move" link onClick={this.handleMenuClick}> Move to... </Menu.Item>
          </Menu>
        ) }

        <Modal size="tiny" open={this.state.openModal} onClose={this.closeModal}>
          <Modal.Header> { this.state.activeMenuItem } </Modal.Header>
          { this.renderModalContent(this.state.activeMenuItem) }
          <Modal.Actions>
            <Button basic compact onClick={this.closeModal}> Cancel </Button>
            <Button color="green" compact onClick={this.handleSave}> Save </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    ) : null
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.signInData.userId
  }
}

export default connect(mapStateToProps)(ContextMenu)