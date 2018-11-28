import { KeyBindingUtil, getDefaultKeyBinding } from 'draft-js'

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
  { key: 'arrow', }
]