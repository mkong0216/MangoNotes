import { UPDATE_EDITOR_STYLES } from './index'

export function updateEditorStyles (name, value) {
  return {
    type: UPDATE_EDITOR_STYLES,
    name,
    value
  }
}
