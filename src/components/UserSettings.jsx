import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form, Select, Checkbox } from 'semantic-ui-react'

class UserSettings extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      hierarchy: 'default',
      fontFamily: null,
      fontSize: null
    }
  }

  handleChange = (event, { name, value }) => { this.setState({ [name]: value })}

  render () {
    return (
      <Modal open={this.props.open} size="small">
        <Modal.Header> Personalize your notetaking settings </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field control={Select} label="Default Font Family" placeholder="Default Font Family" />
              <Form.Field control={Select} label="Default Font Size" placeholder="Default Font Size" />
            </Form.Group>
            <Form.Group inline width="equal">
              <Form.Field label="Bullet Hierarchy:" />
              <Form.Field
                name="hierarchy"
                value="default"
                control={Checkbox}
                label="Use default hierarchy"
                onChange={this.handleChange}
                checked={(this.state.hierarchy === 'default')}
              />
              <Form.Field
                name="hierarchy"
                value="custom"
                control={Checkbox}
                label="Use custom hierarchy"
                onChange={this.handleChange}
                checked={(this.state.hierarchy === 'custom')}
              />
            </Form.Group>
            <Form.Group inline width="equal" compa>
              <Form.Field control={Select} label="First bullet point" />
              <Form.Field control={Select} label="Second bullet point" />
              <Form.Field control={Select} label="Third bullet point" />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary content="Save Settings" />
          <Button content="Cancel" onClick={this.props.closeModal} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default UserSettings