import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Popup, Divider } from 'semantic-ui-react'
import { GithubPicker } from 'react-color'
import { DEFAULT_COLORS } from '../textEditor'
import '../css/Toolbar.css'

const BLOCK_TYPES = [
  { name: 'list ul', type: 'block', label: 'Bulleted list', style: 'unordered-list-item' },
  { name: 'list ol', type: 'block', label: 'Numbered list', style: 'ordered-list-item' },
  { name: 'list alternate outline', type: 'block', label: 'Default hierarchy', style: 'unordered-list-item' },
]

const TEXT_ALIGN = [
  { name: 'align left', label: 'Left align' },
  { name: 'align center', label: 'Center align' },
  { name: 'align right', label: 'Right align' },
  { name: 'align justify', label: 'Justify' }
]

const INLINE_STYLES = [
  { name: 'bold', type: 'inline', label: 'Bold', style: 'BOLD' },
  { name: 'italic', type: 'inline', label: 'Italic', style: 'ITALIC' },
  { name: 'underline', type: 'inline', label: 'Underline', style: 'UNDERLINE' },
  { name: 'strikethrough', type: 'inline', label: 'Strikethrough', style: 'STRIKETHROUGH' }
]

class Toolbar extends React.Component {
  static propTypes = {
    toggleBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      showColorPalette: false,
      background: '#000000'
    }
  }

  componentDidMount () {
    this.textColor.ref.style.setProperty("background", this.state.background, "important")
  }

  toggleColorPicker = () => { this.setState({ showColorPalette: !this.state.showColorPalette }) }

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex })
    this.textColor.ref.style.setProperty("background", color.hex, "important")
  }

  handleToggle = (event, { name, value }) => {
    event.preventDefault()
    if (name === 'block') {
      this.props.toggleBlockType(value)
    } else if (name === 'inline') {
      this.props.toggleInlineStyle(value)
    }
  }

  renderToolIcons = (icons) => {
    return icons.map((icon) => {
      return (
        <Popup
          trigger={(
            <Button
              icon={icon.name}
              value={icon.style}
              onClick={this.handleToggle}
              name={icon.type}
            />
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
        <Button.Group fluid size="small" basic>
          { this.renderToolIcons(INLINE_STYLES) }
        </Button.Group>
        <Divider hidden />
        <Button.Group fluid size="small" basic>
          { this.renderToolIcons(BLOCK_TYPES) }
        </Button.Group>
        <Divider hidden />
        <Button.Group fluid size="small" basic>
          { this.renderToolIcons(TEXT_ALIGN) }
        </Button.Group>
        <Divider hidden />
      </Segment>
    )
  }
}

export default Toolbar
