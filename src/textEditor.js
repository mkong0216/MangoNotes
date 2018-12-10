import React from 'react'
import { KeyBindingUtil, getDefaultKeyBinding, CompositeDecorator } from 'draft-js'
import { Image } from 'semantic-ui-react'
import arrow from './images/bulletpoints/arrow-right.png'
import chevron from './images/bulletpoints/chevron-right.png'
import circleFilled from './images/bulletpoints/circle-filled.png'
import circleOutline from './images/bulletpoints/circle-outline.png'
import squareFilled from './images/bulletpoints/square-filled.png'
import squareOutline from './images/bulletpoints/square-outline.png'
import thinArrow from './images/bulletpoints/thin-arrow-right.png'

export const DEFAULT_COLORS = [
  '#000000', '#AAAAAA', '#DDDDDD', '#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970',
  '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#F012BE', '#B10DC9'
]

export function handleCustomKeyBindingsFn (event) {
  if (event.keyCode === 83 && KeyBindingUtil.hasCommandModifier(event)) {
    return 'mangonotes-save'
  }

  return getDefaultKeyBinding(event)
}

export const BULLET_POINTS = [
  {
    key: 'circleFilled',
    text: <span> <Image src={circleFilled} avatar /> Filled Circle </span>,
    value: circleFilled
  },
  {
    key: 'circleOutline',
    text: <span> <Image src={circleOutline} avatar /> Circle Outline </span>,
    value: circleOutline
  },
  {
    key: 'squareFilled',
    text: <span> <Image src={squareFilled} avatar /> Shaded Square </span>,
    value: squareFilled
  },
  {
    key: 'squareOutline',
    text: <span> <Image src={squareOutline} avatar /> Square Outline </span>,
    value: squareOutline
  },
  {
    key: 'arrow',
    text: <span> <Image src={arrow} avatar /> Arrow </span>,
    value: arrow
  },
  {
    key: 'chevron',
    text: <span> <Image src={chevron} avatar /> Chevron </span>,
    value: chevron
  },
  {
    key: 'thinArrow',
    text: <span> <Image src={thinArrow} avatar /> Thin Arrow </span>,
    value: thinArrow
  }
]

export const FONT_SIZES = [
  { key: 8, text: '8', value: '8pt' },
  { key: 9, text: '9', value: '9pt' },
  { key: 10, text: '10', value: '10pt' },
  { key: 11, text: '11', value: '11pt' },
  { key: 12, text: '12', value: '12pt' },
  { key: 14, text: '14', value: '14pt' },
  { key: 18, text: '18', value: '18pt' },
  { key: 24, text: '24', value: '24pt' },
  { key: 30, text: '30', value: '30pt' },
  { key: 36, text: '36', value: '36pt' },
  { key: 48, text: '48', value: '48pt' },
  { key: 60, text: '60', value: '60pt' },
  { key: 72, text: '72', value: '72pt' },
  { key: 96, text: '96', value: '96pt' }
]

export const FONT_FAMILIES = [
  {
    key: 'Arial',
    text: <span style={{fontFamily: 'Arial'}}> Arial </span>,
    value: 'Arial'
  },
  {
    key: 'Times New Roman',
    text: <span style={{fontFamily: 'Times New Roman'}}> Times New Roman </span>,
    value: 'Times New Roman'
  },
  {
    key: 'Times',
    text: <span style={{fontFamily: 'Times'}}> Times </span>,
    value: 'Times'
  },
  {
    key: 'Georgia',
    text: <span style={{fontFamily: 'Georgia'}}> Georgia </span>,
    value: 'Georgia'
  },
  {
    key: 'Century',
    text: <span style={{fontFamily: 'Century'}}> Century </span>,
    value: 'Century'
  }
]

export const FONT_STYLES = [
  { key: 'italic', text: <span style={{fontStyle: 'italic'}}> Italics </span>, value: 'italic' },
  { key: 'bold', text: <span style={{fontWeight: 'bold'}}> Bold </span>, value: 'bold' },
  { key: 'underline', text: <span style={{textDecoration: 'underline'}}> Underline </span>, value: 'underline' },
  { key: 'normal', text: 'Normal', value: 'normal' }
]

function symbolStrategy (contentBlock, callback, contentState, symbol) {
  const REGEX_VALUE = new RegExp(`(\\${symbol}.+?\\${symbol})`, 'g')
  findWithRegex(REGEX_VALUE, contentBlock, callback)
}

const SymbolSpan = (props, style) => {
  return <span {...props} style={style}>{ props.children }</span>
}

export function getDisplayStyle (fontStyle, highlightColor) {
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

export function createCompositeDecorator (symbols) {
  const decorators = symbols.map((symbol) => {
    const style = getDisplayStyle(symbol.fontStyle, symbol.highlightColor)
    return {
      strategy: (...args) => { symbolStrategy(...args, symbol.symbol) },
      component: (props) => { return SymbolSpan(props, style) }
    }
  })

  return new CompositeDecorator(decorators)
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}
