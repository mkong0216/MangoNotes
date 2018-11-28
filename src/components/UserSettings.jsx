import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Modal, Button, Form, Select, Checkbox } from 'semantic-ui-react'
import { BULLET_POINTS } from '../textEditor'
import '../css/UserSettings.css'

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
      fontSize: null,
      bulletPoints: [BULLET_POINTS[0].value, BULLET_POINTS[1].value, BULLET_POINTS[2].value]
    }
  }

  async componentDidMount () {
    const endpoint = `/setting/${this.props.username}`
    try {
      const response = await axios.get(endpoint, {
        username: this.props.username
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  handleChange = (event, { name, value }) => { this.setState({ [name]: value })}

  handleSelectBullet = (event, { name, value }) => {
    const updatedBulletpoints = [...this.state.bulletPoints]
    updatedBulletpoints[name] = value
    this.setState({ bulletPoints: updatedBulletpoints })
  }

  render () {
    console.log(BULLET_POINTS)
    return (
      <Modal open={this.props.open} size="small">
        <Modal.Header> Personalize your notetaking settings </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field control={Select} label="Default Font Family" options={BULLET_POINTS} placeholder="Default Font Family" />
              <Form.Field control={Select} label="Default Font Size" options={BULLET_POINTS} placeholder="Default Font Size" />
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
            <Form.Group inline width="equal" className="bulletpoints">
              <Form.Field
                control={Select}
                name={0}
                disabled={this.state.hierarchy === 'default'}
                options={BULLET_POINTS}
                label="First bullet point" 
                value={this.state.bulletPoints[0]}
                onChange={this.handleSelectBullet}
              />
              <Form.Field
                control={Select}
                name={1}
                disabled={this.state.hierarchy === 'default'}
                options={BULLET_POINTS}
                label="Second bullet point"
                value={this.state.bulletPoints[1]}
                onChange={this.handleSelectBullet}
              />
              <Form.Field
                control={Select}
                name={2}
                disabled={this.state.hierarchy === 'default'}
                options={BULLET_POINTS}
                label="Third bullet point" 
                value={this.state.bulletPoints[2]}
                onChange={this.handleSelectBullet}
              />
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