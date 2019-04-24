import React from 'react'
import { keyboardEvent } from '@slate-editor/utils'
import { ThemeProvider } from 'theme-ui'

import theme from '../../components/theme'
import Toolbar from './Toolbar'
import Tooltip from './Tooltip'

const toggleBold = editor => {
  editor.toggleMark('bold').focus()
}

const toggleItalic = editor => {
  editor.toggleMark('italic').focus()
}

const toggleBlockQuote = editor => {
  if (editor.hasOuterBlock('block-quote')) {
    editor.unwrapBlock('block-quote')
  } else {
    editor.wrapBlock('block-quote')
  }
}

const toggleHeading = (editor, level) => {
  if (editor.hasBlock('heading-one')) {
    console.log('H1')
  } else if (editor.hasBlock('heading-two')) {
    console.log('H2')
  } else {
  }
}

const toggleHeadingOne = editor => {
  if (editor.hasBlock('heading-one')) {
    editor.setBlocks('paragraph')
  } else {
    editor.setBlocks('heading-one')
  }
}

const toggleHeadingTwo = editor => {
  if (editor.hasBlock('heading-two')) {
    editor.setBlocks('paragraph')
  } else {
    editor.setBlocks('heading-two')
  }
}

const hasBlock = (editor, type) => {
  return editor.value.blocks.some(node => node.type === type)
}

// Certain nodes like list-items and block-quotes have an inner
// paragraph so we need to query the parent node rather than
// the start block
const hasOuterBlock = (editor, type) => {
  const { value } = editor
  const { startBlock, document } = value

  if (!startBlock) {
    return false
  }

  const outerBlock = document.getParent(startBlock.key)

  return outerBlock && outerBlock.type === type
}

export default (opts = {}) => ({
  queries: {
    hasBlock,
    hasOuterBlock
  },
  commands: {
    toggleBold,
    toggleItalic,
    toggleBlockQuote,
    toggleHeading,
    toggleHeadingOne,
    toggleHeadingTwo
  },
  onKeyDown: (event, editor, next) => {
    if (!keyboardEvent.isMod(event)) return next()

    // these could live elsewhere...
    switch (event.key) {
      case 'b':
        toggleBold(editor)
        break
      case 'i':
        toggleItalic(editor)
        break
      default:
        next()
    }
  },
  renderEditor: (props, editor, next) => {
    const children = next()

    return (
      <ThemeProvider theme={theme}>
        <Toolbar editor={editor} />
        {children}
        <Tooltip editor={editor} />
      </ThemeProvider>
    )
  }
})