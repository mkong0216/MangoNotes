import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Grid } from 'semantic-ui-react'
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import Toolbar from './Toolbar'
import CustomInlineToolbar from './CustomInlineToolbar'

import { createCompositeDecorator, handleKeyBindings } from '../textEditor'
import { updateNotepage } from '../xhr/notepage'

import '../css/TextEditor.css'
import '../../node_modules/draft-js/dist/Draft.css'
import '../../node_modules/draft-js-inline-toolbar-plugin/lib/plugin.css'

import createListDepthPlugin from 'draft-js-list-depth-plugin'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';

const inlineToolbarPlugin = createInlineToolbarPlugin()
const { InlineToolbar } = inlineToolbarPlugin

const plugins = [
  createListDepthPlugin(),
  inlineToolbarPlugin
]

class TextEditor extends React.Component {
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

    this.editor = React.createRef()
  }

  componentDidUpdate (prevProps) {
    if ((!prevProps.settings && this.props.settings) || (prevProps.settings !== this.props.settings)) {
      this.applyUserSettings(this.props.settings)
    }

    if (!prevProps.saveContents && this.props.saveContents) {
      this.handleSaveContents(this.state.editorState)
    }
  }

  applyUserSettings = (settings) => {
    if (settings.symbols) {
      const decorators = createCompositeDecorator(settings.symbols)
      const contentState = this.state.editorState.getCurrentContent()
      const newEditorState = (contentState) ? EditorState.createWithContent(contentState, decorators) : EditorState.createEmpty(decorators)
      this.handleChange(newEditorState)
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
    } else if (command === 'mangonotes-save') {
      this.handleSaveContents(editorState)
      return 'handled'
    }

    return 'not-handled';
  }

  getCurrentBlockType = () => {
    const selection = this.state.editorState.getSelection()
    const blockType = this.state.editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return blockType
  }

  getCurrentInlineStyle = () => {
    return this.state.editorState.getCurrentInlineStyle()
  }

  onTab = (event) => {
    const maxDepth = 3
    const newState = RichUtils.onTab(event, this.state.editorState, maxDepth)
    this.handleChange(newState)
  }

  toggleBlockType = (blockType) => {
    this.handleChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    )
  }

  toggleInlineStyle = (inlineStyle) => {
    this.handleChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    )
  }

  applyCustomBlockStyles = (contentBlock) => {
    const type = contentBlock.getType()
    const textAlignments = ['align-left', 'align-right', 'align-center', 'align-justify']

    if (type === 'unordered-list-item') {
      const depth = contentBlock.getDepth()
      const { bulletPoints } = this.props.settings
      const bulletType = (bulletPoints && bulletPoints[depth % 3]) || ''

      return `custom-list-item ${bulletType}`
    } else if (textAlignments.includes(type)) {
      return type
    }
  }

  render () {
    if (!this.props.settings) return null

    const { fontFamily, fontSize } = this.props.settings
    const style = { fontFamily, fontSize }

    return (
      <Grid.Row>
        <Grid.Column width={3}>
          <Toolbar
            toggleInlineStyle={this.toggleInlineStyle}
            toggleBlockType={this.toggleBlockType}
            getCurrentBlockType={this.getCurrentBlockType}
            getCurrentInlineStyle={this.getCurrentInlineStyle}
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <div className="text-editor" style={style}>
            <Editor
              ref={this.editor}
              editorState={this.state.editorState}
              onChange={this.handleChange}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={handleKeyBindings}
              readOnly={this.props.readOnly}
              onTab={this.onTab}
              blockStyleFn={this.applyCustomBlockStyles}
              spellCheck
              plugins={plugins}
            />
            <InlineToolbar>
              { (props) => <CustomInlineToolbar {...props} /> }
            </InlineToolbar>
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

function mapStateToProps (state) {
  return {
    settings: state.user.settings
  }
}

export default connect(mapStateToProps)(TextEditor)
