import React from 'react'
import { KeyBindingUtil, getDefaultKeyBinding } from 'draft-js'
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

export const FONT_STYLES = ['bold', 'italic', 'underline']

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