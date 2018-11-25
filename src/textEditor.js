import { getDefaultKeyBinding, Modifier } from 'draft-js'

const TAB_CHARACTER = '    '

export const DEFAULT_COLORS = [
  '#000000', '#AAAAAA', '#DDDDDD', '#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970',
  '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#F012BE', '#B10DC9'
]

export function customKeyBindingsFn (event) {
  if (event.keyCode === 9) {
    console.log('here')
    return 'indent'
  }

  return getDefaultKeyBinding(event)
}

export function handleCustomKeyCommands (command, editorState) {
  if (command === 'indent') {
    const currentState = editorState
    const newContentState = Modifier.replaceText(
      currentState.getCurrentContent(),
      currentState.getSelection(),
      TAB_CHARACTER
    )

    return newContentState
  } else {
    return null
  }
}

