import React from 'react'
import {
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  HeadlineOneButton,
  HeadlineTwoButton,
} from 'draft-js-buttons'

class CustomInlineToolbar extends React.Component {
  render () {
    return (
      <React.Fragment>
        <HeadlineOneButton {...this.props} />
        <HeadlineTwoButton {...this.props} />
        <UnorderedListButton {...this.props} />
        <OrderedListButton {...this.props} />
        <BlockquoteButton {...this.props} />
        <CodeBlockButton {...this.props} />
      </React.Fragment>
    )
  }
}

export default CustomInlineToolbar
