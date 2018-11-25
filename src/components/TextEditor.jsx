import React from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import { FONT_STYLES } from '../textEditor'
import { updateEditorStyles } from '../store/actions/editor'
import '../css/TextEditor.css'

class TextEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.editor = React.createRef()
  }

  handleFocusEditor = () => { this.editor.current.focus() }

  handleChange = (editorState) => { this.setState({ editorState })}

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      if (FONT_STYLES.includes(command)) {
        const currFontStyles = this.props.editorStyles.activeButtons.fontStyle
        if (currFontStyles.includes(command)) {
          const index = currFontStyles.findIndex(style => style === command)
          currFontStyles.splice(index, 1)
        } else {
          currFontStyles.push(command)
        }

        this.props.updateEditorStyles('fontStyle', currFontStyles)
      }

      this.handleChange(newState)
      return 'handled'
    } else {
      return 'not-handled'
    }
  }

  handleTab = (event) => {
    event.preventDefault()

    const TAB_CHARACTER = '    '
    const currentState = this.state.editorState
    const newContentState = Modifier.replaceText(
      currentState.getCurrentContent(),
      currentState.getSelection(),
      TAB_CHARACTER
    )

    this.setState({ editorState: EditorState.push(currentState, newContentState, 'insert-characters') })
  }

  render () {
    return (
      <div className="text-editor" onClick={this.handleFocusEditor}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
          onTab={this.handleTab}
          spellCheck
          ref={this.editor}
        />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor)
