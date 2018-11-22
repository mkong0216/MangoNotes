import React from 'react'
import { Segment, Button, Divider, Popup } from 'semantic-ui-react'
import { TwitterPicker } from 'react-color'
import '../css/Toolbar.css'

const TOOLBAR_ICONS = [
  { group: 'font-style', icons: [
    { name: 'bold', label: 'Bold' },
    { name: 'italic', label: 'Italic' },
    { name: 'underline', label: 'Underline' },
    { name: 'strikethrough', label: 'Strikethrough' }
  ] },
  { group: 'text-align', icons: [
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
      showColorPalette: false,
      textColor: '#fff'
    }
  }

  renderToolIcons = (icons) => {
    return icons.map((icon) => {
      return (
        <Popup
          trigger={(<Button icon={icon.name} />)}
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
          <Button.Group basic fluid size="small">
            { this.renderToolIcons(section.icons) }
          </Button.Group>
          <Divider hidden />
        </React.Fragment>
      )
    })
  }

  toggleColorPicker = (event) => { this.setState({ showColorPalette: !this.state.showColorPalette }) }

  handleChangeComplete = (color) => {
    this.setState({ textColor: color.hex })
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
          <TwitterPicker color={this.state.background} onChangeComplete={this.handleChangeComplete} />
        }
        <Divider hidden />
        { this.renderToolGroups() }
      </Segment>
    )
  }
}

export default Toolbar
