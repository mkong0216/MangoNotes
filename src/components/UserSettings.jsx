import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Modal, Button, Form, Header } from 'semantic-ui-react'
import SymbolForm from './SymbolForm'
import { BULLET_POINTS, FONT_SIZES, FONT_FAMILIES } from '../textEditor'
import { saveUserSettings } from '../xhr/settings'
import { setUserSettings } from '../store/actions/user'
import '../css/UserSettings.css'

class UserSettings extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    username: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      showColorPalette: false,
      hierarchy: 'default',
      fontFamily: null,
      fontSize: null,
      bulletPoints: [BULLET_POINTS[0].value, BULLET_POINTS[1].value, BULLET_POINTS[2].value],
      symbols: [],
      symbolFormErrors: null
    }
  }

  async componentDidMount () {
    const endpoint = `/settings/${this.props.username}`
    try {
      const response = await axios.get(endpoint)
      const settings = (response.data.default) ? response.data.settings : JSON.parse(response.data.settings)
      this.setState({...settings})
      this.props.setUserSettings(settings)
    } catch (error) {
      console.log(error)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.symbols.length > this.state.symbols.length) {
      const errors = this.checkForErrors()
      this.setState({ symbolFormErrors: errors })
    } else if (prevState.hierarchy !== this.state.hierarchy && this.state.hierarchy === 'default') {
      this.setState({
        bulletPoints: [BULLET_POINTS[0].value, BULLET_POINTS[1].value, BULLET_POINTS[2].value]
      })
    }
  }

  handleChange = (event, { name, value }) => { this.setState({ [name]: value })}

  handleSelectBullet = (event, { name, value }) => {
    const updatedBulletpoints = [...this.state.bulletPoints]
    updatedBulletpoints[name] = value
    this.setState({ bulletPoints: updatedBulletpoints })
  }

  renderSymbolForm = (symbols) => {
    return symbols.map((symbol, i) => {
      return (
        <SymbolForm
          key={i}
          symbolInfo={symbol}
          index={i}
          handleChange={this.handleChangeSymbolForm}
          handleRemove={this.handleRemoveSymbol}
        />
      )
    })
  }

  checkForErrors = () => {
    // Check if duplicate symbols
    // Check if previous symbol row have null values when required
    // Check if symbol does not have any style changes and any meaning
    const lastSymbol = this.state.symbols[this.state.symbols.length - 1]
    const duplicate = this.state.symbols.filter((symbol) => {
      return (symbol.symbol === lastSymbol.symbol || (symbol.tag && symbol.tag === lastSymbol.tag))
    })

    const missingRequired = this.state.symbols.filter(symbol => !symbol.symbol)
    const missingStyles = this.state.symbols.filter(symbol => !symbol.fontStyle && !symbol.highlightColor && !symbol.tag)

    if (duplicate.length > 1) {
      return `Looks like there was a duplicate value. Please input unique symbols and tags.`
    } else if (missingRequired.length) {
      return 'Looks like you did not include a symbol. Please input a unique symbol to change.'
    } else if (missingStyles.length) {
      return 'Looks like one of your symbols does not have any style changes or a tag value. Please select a style change or input a tag value.'
    }

    return null
  }

  handleChangeSymbolForm = (name, value, index) => {
    const changedSymbol = this.state.symbols[index]
    changedSymbol[name] = value

    this.setState({
      symbolFormErrors: null,
      symbols: [
        ...this.state.symbols.slice(0, index),
        changedSymbol,
        ...this.state.symbols.slice(index + 1)
      ]
    })
  }

  handleRemoveSymbol = (index) => {
    this.setState({
      symbols: [
        ...this.state.symbols.slice(0, index),
        ...this.state.symbols.slice(index + 1)
      ]
    })
  }

  createNewSymbolForm = () => {
    const errors = this.checkForErrors()

    if (!errors) {
      this.setState({
        symbolFormErrors: null,
        symbols: [
          ...this.state.symbols,
          { symbol: '', tag: '', fontStyle: null, highlightColor: null }
        ]
      })
    } else {
      this.setState({
        symbolFormErrors: errors
      })
    }
  }

  handleSaveSettings = async () => {
    const { hierarchy, fontFamily, fontSize, bulletPoints, symbols } = this.state
    const errors = this.checkForErrors()

    if (errors) {
      this.setState({ symbolFormErrors: errors })
      return
    }

    if (hierarchy === 'default' && fontFamily === 'Times New Roman' && fontSize === '14pt' && !symbols.length) {
      console.log("using default settings")
    } else {
      const settings = { fontFamily, fontSize, bulletPoints, symbols, hierarchy }
      await saveUserSettings(this.props.username, settings)
      this.props.setUserSettings(settings)
    }

    this.props.closeModal()
  }

  render () {
    if (!this.props.settings) return null

    const { fontFamily, fontSize, bulletPoints, symbols, hierarchy } = this.state

    return (
      <Modal open={this.props.open} onClose={this.props.closeModal} size="large">
        <Modal.Header> Personalize your notetaking settings </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                label="Default Font Family"
                name="fontFamily"
                options={FONT_FAMILIES}
                placeholder="Default Font Family"
                value={fontFamily}
                onChange={this.handleChange}
              />
              <Form.Select
                label="Default Font Size"
                name="fontSize"
                options={FONT_SIZES}
                placeholder="Default Font Size"
                value={fontSize}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group inline width="equal">
              <Form.Field label="Bullet Hierarchy:" />
              <Form.Radio
                name="hierarchy"
                value="default"
                label="Use default hierarchy"
                onChange={this.handleChange}
                checked={(hierarchy === 'default')}
              />
              <Form.Radio
                name="hierarchy"
                value="custom"
                label="Use custom hierarchy"
                onChange={this.handleChange}
                checked={(hierarchy === 'custom')}
              />
            </Form.Group>
            <Form.Group width="equal" className="bulletpoints">
              <Form.Select
                name={0}
                disabled={hierarchy === 'default'}
                options={BULLET_POINTS}
                label="First bullet point" 
                value={bulletPoints[0]}
                onChange={this.handleSelectBullet}
              />
              <Form.Select
                name={1}
                disabled={hierarchy === 'default'}
                options={BULLET_POINTS}
                label="Second bullet point"
                value={bulletPoints[1]}
                onChange={this.handleSelectBullet}
              />
              <Form.Select
                name={2}
                disabled={hierarchy === 'default'}
                options={BULLET_POINTS}
                label="Third bullet point" 
                value={bulletPoints[2]}
                onChange={this.handleSelectBullet}
              />
            </Form.Group>
            <Form.Field label="Symbol Signifiers:" />
            { this.state.symbolFormErrors && 
              <Header as="h4" color="red"> { this.state.symbolFormErrors } </Header>
            }
            <SymbolForm example />
            { this.renderSymbolForm(symbols) }
            <Form.Button
              icon="plus"
              content="Add a symbol signifier"
              labelPosition="left"
              compact primary
              onClick={this.createNewSymbolForm}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" content="Save Settings" onClick={this.handleSaveSettings} />
          <Button content="Cancel" onClick={this.props.closeModal} />
        </Modal.Actions>
      </Modal>
    )
  }
}

function mapStateToProps (state) {
  return {
    settings: state.user.settings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setUserSettings: (...args) => { dispatch(setUserSettings(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)