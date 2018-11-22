import React from 'react'
import { Editor, EditorState } from 'draft-js'
import '../css/TextEditor.css'

class TextEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.onChange = (editorState) => this.setState({ editorState })
  }

  render () {
    return (
      <div className="text-editor">
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        Testing
      </div>
    )
  }
}

export default TextEditor
