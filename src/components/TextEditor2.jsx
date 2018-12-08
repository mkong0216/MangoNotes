import React from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js'
import { updateNotepage } from '../xhr/notepage'
import '../css/TextEditor.css'

class TextEditor2 extends React.Component {
  static propTypes = {
    details: PropTypes.object.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    saveContents: PropTypes.bool.isRequired,
    toggleSaveContents: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    const contentState = (props.content && convertFromRaw(props.content))

    this.state = {
      editorState: (contentState) ? EditorState.createWithContent(contentState) : EditorState.createEmpty(),
      error: null
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.saveContents && this.props.saveContents) {
      this.handleSaveContents(this.state.editorState)
    }
  }

  handleSaveContents = async (editorState) => {
    const contentState = editorState.getCurrentContent()
    const rawContent = JSON.stringify(convertToRaw(contentState))
    
    const { updatedAt, ...notepage } = this.props.details
    notepage.content = rawContent

    try {
      await updateNotepage(notepage, this.props.userId)
    } catch (error) {
      console.log(error)
      this.setState({ error: error.message })
    }

    this.props.toggleSaveContents()
  }

  handleChange = (editorState) => { this.setState({ editorState })}

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  render () {
    return (
      <div className="text-editor">
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    )
  }
}

export default TextEditor2
