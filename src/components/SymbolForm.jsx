import React from 'react'
import { Form, Button, Label } from 'semantic-ui-react'
import { GithubPicker } from 'react-color'
import { FONT_STYLES } from '../textEditor'

class SymbolForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      highlightColor: '#fff',
      showColorPalette: false,
      example: {
        symbol: '*',
        tag: 'Vocab',
        fontStyle: 'bold',
        highlightColor: 'yellow'
      }
    }
  }

  toggleColorPicker = () => { this.setState({ showColorPalette: !this.state.showColorPalette }) }

  handleChangeColor = (color) => {
    this.setState({
      highlightColor: color.hex,
      showColorPalette: false
    })

    this.highlightColor.ref.style.setProperty("background", color.hex, "important")
    this.props.handleChange('highlightColor', color.hex, this.props.index)
  }

  getDisplayStyle = (fontStyle, highlightColor) => {
    const style = {
      background: highlightColor
    }

    if (fontStyle === 'italic') {
      style.fontStyle = fontStyle
    } else if (fontStyle === 'bold') {
      style.fontWeight = fontStyle
    } else if (fontStyle === 'underline') {
      style.textDecoration = fontStyle
    }

    return style
  }

  render () {
    const symbol = (this.props.example && this.state.example.symbol) || this.props.symbolInfo.symbol
    const tagValue = (this.props.example && this.state.example.tag) || this.props.symbolInfo.tag
    const fontStyle = (this.props.example && this.state.example.fontStyle) || this.props.symbolInfo.fontStyle
    const highlightColor = (this.props.example && this.state.example.highlightColor) || this.props.symbolInfo.highlightColor
    
    const displayText = (symbol) ? `${symbol}Text${symbol}` : 'Text'
    const displayStyle = this.getDisplayStyle(fontStyle, highlightColor)

    return (
      <Form.Group width="equal" inline className={(this.props.example) ? "example" : "symbol-form"}>
        <Form.Input
          name="symbol"
          readOnly={this.props.example}
          value={symbol}
          placeholder="Symbol"
          onChange={(event, { name, value }) => { this.props.handleChange(name, value, this.props.index) }}
        />
        <Form.Input
          name="tag"
          readOnly={this.props.example}
          value={tagValue}
          placeholder="Tag Value"
          onChange={(event, { name, value }) => { this.props.handleChange(name, value, this.props.index) }}
        />
        <Button
          className="highlight-color"
          content="Highlight"
          basic
          disabled={this.props.example}
          labelPosition="right"
          icon="angle down"
          onClick={this.toggleColorPicker}
          ref={(ref) => { this.highlightColor = ref }}
        />
        { this.state.showColorPalette && 
          <GithubPicker
            className="user-settings color"
            color={this.state.highlightColor}
            onChangeComplete={this.handleChangeColor}
          />
        }
        <Form.Select
          name="fontStyle"
          disabled={this.props.example}
          value={fontStyle}
          placeholder="Font Style"
          options={FONT_STYLES}
          onChange={(event, { name, value }) => { this.props.handleChange(name, value, this.props.index) }}
        />
        <div className="display">
          { displayText } &rarr;
          <span style={displayStyle} className="display-text"> Text </span>
          { (this.props.example) && <Label pointing="left"> Example </Label>}
          { (typeof this.props.index !== 'undefined') &&
            <Button
              className="remove"
              icon="cancel"
              compact
              size="tiny"
              color="red"
              content="Remove"
              onClick={() => { this.props.handleRemove(this.props.index) }}
            />
          }
        </div>
      </Form.Group>
    )
  }
}

export default SymbolForm