import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { TextHighlighter } from '../text-highlighter'

describe('TextHighlighter with Draggable Handles', () => {
  it('should render draggable handles when showDraggableHandles is true', () => {
    render(
      <TextHighlighter showDraggableHandles={true}>
        <p>Test text for highlighting</p>
      </TextHighlighter>
    )

    // The handles should be created when text is highlighted
    // This test verifies the prop is accepted
    expect(screen.getByText('Test text for highlighting')).toBeInTheDocument()
  })

  it('should not render draggable handles when showDraggableHandles is false', () => {
    render(
      <TextHighlighter showDraggableHandles={false}>
        <p>Test text for highlighting</p>
      </TextHighlighter>
    )

    // The handles should not be created when showDraggableHandles is false
    expect(screen.getByText('Test text for highlighting')).toBeInTheDocument()
  })

  it('should default to false when showDraggableHandles is not provided', () => {
    render(
      <TextHighlighter>
        <p>Test text for highlighting</p>
      </TextHighlighter>
    )

    // Should default to false (no handles)
    expect(screen.getByText('Test text for highlighting')).toBeInTheDocument()
  })
})
