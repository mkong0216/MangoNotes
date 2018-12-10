import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js'
import { createCompositeDecorator } from '../textEditor'
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
    toggleSaveContents: PropTypes.func.isRequired,
    settings: PropTypes.object,
    readOnly: PropTypes.bool
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
    if ((!prevProps.settings && this.props.settings) || (prevProps.settings !== this.props.settings)) {
      const decorators = createCompositeDecorator(this.props.settings.symbols)
      const contentState = this.state.editorState.getCurrentContent()
      const newEditorState = (contentState) ? EditorState.createWithContent(contentState, decorators) : EditorState.createEmpty(decorators)
      this.handleChange(newEditorState)
    }

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

  handleChange = (editorState) => { this.setState({ editorState }) }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  render () {
    if (!this.props.settings) return null

    const { fontFamily, fontSize } = this.props.settings
    const style = { fontFamily, fontSize }

    return (
      <div className="text-editor" style={style}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    settings: state.user.settings
  }
}

export default connect(mapStateToProps)(TextEditor2)
