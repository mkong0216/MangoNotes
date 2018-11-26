import React from 'react'
import { connect } from 'react-redux'
import { Segment, Button, Divider, Popup } from 'semantic-ui-react'
import { GithubPicker } from 'react-color'
import { DEFAULT_COLORS } from '../textEditor'
import { updateEditorStyles } from '../store/actions/editor'
import '../css/Toolbar.css'

const TOOLBAR_ICONS = [
  { group: 'fontStyle', icons: [
    { name: 'bold', label: 'Bold' },
    { name: 'italic', label: 'Italic' },
    { name: 'underline', label: 'Underline' },
    { name: 'strikethrough', label: 'Strikethrough' }
  ] },
  { group: 'textAlign', icons: [
    { name: 'align left', label: 'Left align' },
    { name: 'align center', label: 'Center align' },
    { name: 'align right', label: 'Right align' },
    { name: 'align justify', label: 'Justify' }
  ] },
  { group: 'lists', icons: [
    { name: 'list ul', label: 'Bulleted list' },
    { name: 'list ol', label: 'Numbered list' },
    { name: 'list alternate outline', label: 'Default hierarchy' }
  ] }
]

class Toolbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showColorPalette: false
    }
  }

  setActiveButtons = (event, { name, value }) => {
    const updateActiveButtons = { ...this.props.editorStyles.activeButtons }
    if (Array.isArray(updateActiveButtons[name])) {
      // fontStyle buttons can have more than one button be active
      if (updateActiveButtons[name].includes(value)) {
        updateActiveButtons[name] = updateActiveButtons[name].filter(button => button !== value)
      } else {
        updateActiveButtons[name].push(value)
      }
    } else if (updateActiveButtons[name] === value) {
      updateActiveButtons[name] = (name === 'textAlign') ? 'align left' : null
    } else {
      updateActiveButtons[name] = value
    }

    this.props.updateEditorStyles('activeButtons', updateActiveButtons)
  }

  renderToolIcons = (icons, group) => {
    const { activeButtons } = this.props.editorStyles
    return icons.map((icon) => {
      const isActive = (Array.isArray(activeButtons[group])) ? activeButtons[group].includes(icon.name) : activeButtons[group] === icon.name
      return (
        <Popup
          trigger={(
            <Button
              active={isActive}
              icon={icon.name}
              name={group}
              value={icon.name}
              onClick={this.setActiveButtons} />
          )}
          content={icon.label}
          size="mini"
          inverted
          position="bottom center"
          key={icon.name}
        />
      )
    })
  }

  renderToolGroups = () => {
    return TOOLBAR_ICONS.map((section) => {
      return (
        <React.Fragment key={section.group}>
          <Button.Group fluid size="small" basic>
            { this.renderToolIcons(section.icons, section.group) }
          </Button.Group>
          <Divider hidden />
        </React.Fragment>
      )
    })
  }

  toggleColorPicker = (event) => { this.setState({ showColorPalette: !this.state.showColorPalette }) }

  handleChangeComplete = (color) => {
    this.props.updateEditorStyles('textColor', color.hex)
    this.textColor.ref.style.setProperty("background", color.hex, "important")
  }

  render () {
    return (
      <Segment className="toolbar">
        <Button
          className="text-color"
          icon="font"
          content="Font Color"
          compact basic fluid
          labelPosition="left"
          onClick={this.toggleColorPicker}
          ref={(ref) => { this.textColor = ref }}
        />
        { this.state.showColorPalette &&
          <GithubPicker
            color={this.state.background}
            colors={DEFAULT_COLORS}
            onChangeComplete={this.handleChangeComplete}
          />
        }
        <Divider hidden />
        { this.renderToolGroups() }
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    editorStyles: state.editor
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateEditorStyles: (...args) => { dispatch(updateEditorStyles(...args)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
