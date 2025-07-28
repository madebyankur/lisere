import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TextHighlighter } from '../index'
import * as utils from '../utils'

jest.mock('../utils', () => ({
  getCurrentTextSelection: jest.fn(),
  getAdjustedSelection: jest.fn(),
  isValidSelection: jest.fn(),
  isRangeAlreadyHighlighted: jest.fn(),
  isRangeWithinHighlight: jest.fn(),
  clearSelection: jest.fn(),
  highlightRange: jest.fn(),
  findTextInElement: jest.fn(),
  removeHighlight: jest.fn(),
  adjustRangeToWordBoundaries: jest.fn(),
  isSelectionCrossElement: jest.fn(),
  checkRangeIntersection: jest.fn(),
}))

const mockUtils = utils as jest.Mocked<typeof utils>

describe('Selection UI Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUtils.getCurrentTextSelection.mockReturnValue(null)
    mockUtils.getAdjustedSelection.mockReturnValue(null)
    mockUtils.isValidSelection.mockReturnValue(false)
    mockUtils.isRangeAlreadyHighlighted.mockReturnValue(false)
    mockUtils.isRangeWithinHighlight.mockReturnValue(false)
    mockUtils.highlightRange.mockReturnValue(document.createElement('span'))
    mockUtils.findTextInElement.mockReturnValue([])
    mockUtils.clearSelection.mockImplementation(() => {})
    mockUtils.removeHighlight.mockImplementation(() => {})
  })

  describe('Custom Selection UI - Flaky Behavior Fixes', () => {
    it('should show selection UI after text selection', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(
        <div data-testid="selection-ui">
          <button data-testid="confirm-btn">Confirm</button>
          <button data-testid="cancel-btn">Cancel</button>
        </div>
      )

      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {
          left: 100,
          top: 200,
          right: 150,
          bottom: 220,
          width: 50,
          height: 20,
          x: 100,
          y: 200,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter renderSelectionUI={renderSelectionUI}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(screen.getByTestId('selection-ui')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(renderSelectionUI).toHaveBeenCalled()
      expect(mockUtils.highlightRange).toHaveBeenCalled()
    })

    it('should not clear selection immediately when using custom UI', () => {
      const renderSelectionUI = jest.fn().mockReturnValue(<div>UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderSelectionUI={renderSelectionUI}
          clearSelectionAfterHighlight={true}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      expect(mockUtils.clearSelection).not.toHaveBeenCalled()
    })

    it('should clear selection when clicking outside', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(
        <div data-testid="selection-ui">
          <button data-testid="confirm-btn">Confirm</button>
        </div>
      )

      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {
          left: 100,
          top: 200,
          right: 150,
          bottom: 220,
          width: 50,
          height: 20,
          x: 100,
          y: 200,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderSelectionUI={renderSelectionUI}
          clearSelectionAfterHighlight={true}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(screen.getByTestId('selection-ui')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      fireEvent.mouseDown(document.body)

      await waitFor(
        () => {
          expect(mockUtils.clearSelection).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('should handle rapid selection/deselection without issues', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(<div>UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter renderSelectionUI={renderSelectionUI}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))
      fireEvent.mouseUp(screen.getByTestId('test-content'))
      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.getAdjustedSelection).toHaveBeenCalledTimes(1)
        },
        { timeout: 300 }
      )
    })

    it('should not show UI immediately on rapid clicks', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(<div>UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter renderSelectionUI={renderSelectionUI}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      fireEvent.mouseDown(document.body)

      await waitFor(
        () => {
          expect(screen.queryByText('UI')).not.toBeInTheDocument()
        },
        { timeout: 100 }
      )
    })

    it('should properly position selection UI', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(<div>UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {
          left: 100,
          top: 200,
          right: 150,
          bottom: 220,
          width: 50,
          height: 20,
          x: 100,
          y: 200,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter renderSelectionUI={renderSelectionUI}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(renderSelectionUI).toHaveBeenCalledWith({
            selection: mockSelection,
            modifyHighlight: expect.any(Function),
            onClose: expect.any(Function),
          })
        },
        { timeout: 200 }
      )
    })
  })

  describe('Debouncing Behavior', () => {
    it('should debounce rapid selection events', async () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      // Rapidly trigger multiple mouseUp events
      for (let i = 0; i < 5; i++) {
        fireEvent.mouseUp(screen.getByTestId('test-content'))
      }

      // Should only process one selection due to debouncing
      await waitFor(
        () => {
          expect(mockUtils.getAdjustedSelection).toHaveBeenCalledTimes(1)
        },
        { timeout: 300 }
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle highlight creation errors gracefully', async () => {
      const renderSelectionUI = jest.fn().mockReturnValue(<div>UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 100, y: 200 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.highlightRange.mockImplementation(() => {
        throw new Error('Highlight creation failed')
      })

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      render(
        <TextHighlighter renderSelectionUI={renderSelectionUI}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error creating highlight:',
          expect.any(Error)
        )
      })

      consoleSpy.mockRestore()
    })
  })
})
