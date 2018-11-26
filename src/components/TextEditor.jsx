import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw } from 'draft-js'
import { handleCustomKeyBindingsFn } from '../textEditor'
import { updateEditorStyles } from '../store/actions/editor'
import '../css/TextEditor.css'

class TextEditor extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    updateNotepage: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.editor = React.createRef()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.content && this.props.content) {
      const contentState = convertFromRaw(JSON.parse(this.props.content))
      this.handleChange(EditorState.createWithContent(contentState))
    }
  }

  handleFocusEditor = () => { this.editor.current.focus() }

  handleChange = (editorState) => { this.setState({ editorState })}

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.handleChange(newState)
      return 'handled'
    } else if (command === 'mangonotes-save') {
      const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      this.props.updateNotepage(rawContent)
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
          keyBindingFn={handleCustomKeyBindingsFn}
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
