import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Dropdown } from 'semantic-ui-react'
import { createPermissionCode } from '../utils'

const SHARE_PERMISSIONS = [
  { key: 'view', text: 'View Only', value: 'view' },
  { key: 'edit', text: 'Can Edit', value: 'edit' }
]

class ShareModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    noteItem: PropTypes.object,
    type: PropTypes.string,
    userId: PropTypes.string,
  }

  constructor (props) {
    super (props)

    this.state = {
      permissions: 'view',
      code: createPermissionCode(true)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.permissions !== this.state.permissions) {
      this.generateShareLink(this.state.permissions)
    }
  }

  generateShareLink = (permissions) => {
    const readOnly = (permissions === 'view')
    const code = createPermissionCode(readOnly)
    this.setState({ code })
  }

  handleChangePermissions = (event, { value }) => { this.setState({ permissions: value }) }

  savePermissions = () => {
    const noteId = (this.props.noteItem.notebookId || this.props.noteItem.notepageId)
    const { permissions, code } = this.state

    console.log(noteId, permissions, code)
    this.props.closeModal()
  }

  render () {
    const noteId = (this.props.noteItem.notebookId || this.props.noteItem.notepageId)
    const shareLink = `${window.location.hostname}/share/${noteId}/${this.state.code}`

    return (
      <Modal size="tiny" open={this.props.open}>
        <Modal.Header> Share { this.props.noteItem.title } </Modal.Header>
        <Modal.Content>
          <Input
            action={
              <Dropdown
                button basic floating
                options={SHARE_PERMISSIONS}
                value={this.state.permissions}
                onChange={this.handleChangePermissions}
              />
            }
            label="Share Link"
            fluid
            value={shareLink}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" compact onClick={this.savePermissions}> Done </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ShareModal
