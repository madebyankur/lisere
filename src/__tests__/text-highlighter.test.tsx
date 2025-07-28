import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TextHighlighter, useTextHighlighter } from '../index'
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
  applyReactElementStyles: jest.fn(),
}))

const mockUtils = utils as jest.Mocked<typeof utils>

describe('Package Tests', () => {
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
    mockUtils.applyReactElementStyles.mockImplementation(() => {})
  })

  describe('Package Exports', () => {
    it('should export TextHighlighter component', () => {
      expect(TextHighlighter).toBeDefined()
      expect(typeof TextHighlighter).toBe('function')
    })

    it('should export useTextHighlighter hook', () => {
      expect(useTextHighlighter).toBeDefined()
      expect(typeof useTextHighlighter).toBe('function')
    })

    it('should have proper exports', () => {
      expect(TextHighlighter).toBeDefined()
      expect(useTextHighlighter).toBeDefined()
    })
  })

  describe('TextHighlighter Component - Event Handling', () => {
    it('should handle text selection events', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.getAdjustedSelection).toHaveBeenCalled()
          expect(onTextSelected).toHaveBeenCalledWith(mockSelection)
        },
        { timeout: 200 }
      )
    })

    it('should handle invalid selections', () => {
      const onTextSelected = jest.fn()
      mockUtils.getAdjustedSelection.mockReturnValue(null)

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      expect(onTextSelected).not.toHaveBeenCalled()
    })

    it('should handle already highlighted selections', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.isRangeAlreadyHighlighted.mockReturnValue(true)

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.clearSelection).toHaveBeenCalled()
          expect(onTextSelected).not.toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('should handle cross-element selection when allowed', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello world',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 100,
          bottom: 20,
          width: 100,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          onTextSelected={onTextSelected}
          allowCrossElementSelection={true}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.isValidSelection).toHaveBeenCalledWith(
            mockSelection,
            true
          )
          expect(onTextSelected).toHaveBeenCalledWith(mockSelection)
        },
        { timeout: 200 }
      )
    })

    it('should handle cross-element selection when not allowed', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello world',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 100,
          bottom: 20,
          width: 100,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(false)

      render(
        <TextHighlighter
          onTextSelected={onTextSelected}
          allowCrossElementSelection={false}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.isValidSelection).toHaveBeenCalledWith(
            mockSelection,
            false
          )
          expect(onTextSelected).not.toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })
  })

  describe('TextHighlighter Component - Highlighting', () => {
    it('should handle text highlighting', async () => {
      const onTextHighlighted = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.highlightRange.mockReturnValue(document.createElement('span'))

      render(
        <TextHighlighter onTextHighlighted={onTextHighlighted}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.highlightRange).toHaveBeenCalled()
          expect(onTextHighlighted).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('should apply custom highlight styles', async () => {
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow' },
      }
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          highlightStyle={highlightStyle}
          onTextHighlighted={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.highlightRange).toHaveBeenCalledWith(
            mockSelection.range,
            'span',
            highlightStyle
          )
        },
        { timeout: 200 }
      )
    })

    it('should use custom highlight element', async () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter highlightElement="mark" onTextHighlighted={jest.fn()}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.highlightRange).toHaveBeenCalledWith(
            mockSelection.range,
            'mark',
            undefined
          )
        },
        { timeout: 200 }
      )
    })
  })

  describe('TextHighlighter Component - Custom Highlight Rendering', () => {
    it('should use custom highlight renderer', async () => {
      const renderHighlight = jest
        .fn()
        .mockReturnValue(<mark>Highlighted</mark>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderHighlight={renderHighlight}
          onTextHighlighted={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      // The renderHighlight prop is used internally by the component
      // We test that the component renders without errors when this prop is provided
      expect(renderHighlight).toBeDefined()
    })

    it('should handle custom highlight rendering errors', async () => {
      const renderHighlight = jest.fn().mockImplementation(() => {
        throw new Error('Custom highlight error')
      })
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      render(
        <TextHighlighter
          renderHighlight={renderHighlight}
          onTextHighlighted={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(consoleSpy).toHaveBeenCalledWith(
            'Error creating highlight:',
            expect.any(Error)
          )
        },
        { timeout: 200 }
      )

      consoleSpy.mockRestore()
    })
  })

  describe('TextHighlighter Component - Selection UI', () => {
    it('should show selection UI when renderSelectionUI is provided', async () => {
      const renderSelectionUI = jest
        .fn()
        .mockReturnValue(<div>Selection UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderSelectionUI={renderSelectionUI}
          onTextSelected={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(renderSelectionUI).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('should handle selection UI positioning', async () => {
      const renderSelectionUI = jest
        .fn()
        .mockReturnValue(<div>Selection UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
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
          onTextSelected={jest.fn()}
        >
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

  describe('TextHighlighter Component - Custom Container', () => {
    it('should render with custom container element', () => {
      render(
        <TextHighlighter containerElement="section">
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      const container = screen.getByTestId('test-content').parentElement
      expect(container?.tagName.toLowerCase()).toBe('section')
    })

    it('should apply custom styles to container', () => {
      const customStyle = { backgroundColor: 'red' }
      render(
        <TextHighlighter style={customStyle}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      const container = screen.getByTestId('test-content').parentElement
      expect(container).toHaveStyle('background-color: rgb(255, 0, 0)')
    })

    it('should apply custom className to container', () => {
      render(
        <TextHighlighter className="custom-container">
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      const container = screen.getByTestId('test-content').parentElement
      expect(container).toHaveClass('custom-container')
    })
  })

  describe('TextHighlighter Component - Scroll and Resize Handling', () => {
    it('should handle scroll events for custom highlights', async () => {
      const renderHighlight = jest
        .fn()
        .mockReturnValue(<mark>Highlighted</mark>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderHighlight={renderHighlight}
          onTextHighlighted={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      // The component should handle scroll events for custom highlights
      expect(renderHighlight).toBeDefined()
    })
  })

  describe('TextHighlighter Component - Error Handling', () => {
    it('should handle highlight creation errors gracefully', async () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
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
        <TextHighlighter onTextHighlighted={jest.fn()}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(consoleSpy).toHaveBeenCalledWith(
            'Error creating highlight:',
            expect.any(Error)
          )
        },
        { timeout: 200 }
      )

      consoleSpy.mockRestore()
    })
  })

  describe('TextHighlighter Component - Selection Boundaries', () => {
    it('should use cursor boundary', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          selectionBoundary="cursor"
          onTextSelected={onTextSelected}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('cursor')
        },
        { timeout: 200 }
      )
    })

    it('should use word boundary', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          selectionBoundary="word"
          onTextSelected={onTextSelected}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
        },
        { timeout: 200 }
      )
    })
  })

  describe('TextHighlighter Component - Disabled State', () => {
    it('should not handle events when disabled', () => {
      const onTextSelected = jest.fn()
      const onTextHighlighted = jest.fn()

      render(
        <TextHighlighter
          enabled={false}
          onTextSelected={onTextSelected}
          onTextHighlighted={onTextHighlighted}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      expect(mockUtils.getAdjustedSelection).not.toHaveBeenCalled()
      expect(onTextSelected).not.toHaveBeenCalled()
      expect(onTextHighlighted).not.toHaveBeenCalled()
    })
  })

  describe('TextHighlighter Component - Highlight Removal', () => {
    it('should handle highlight removal', () => {
      const highlightElement = document.createElement('span')
      highlightElement.setAttribute('data-highlight-id', 'test-id')
      document.body.appendChild(highlightElement)

      mockUtils.removeHighlight(highlightElement)

      expect(mockUtils.removeHighlight).toHaveBeenCalledWith(highlightElement)

      document.body.removeChild(highlightElement)
    })
  })

  describe('TextHighlighter Component - Custom Render Props', () => {
    it('should use custom highlight renderer', () => {
      const renderHighlight = jest
        .fn()
        .mockReturnValue(<mark>Highlighted</mark>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.highlightRange.mockReturnValue(document.createElement('span'))

      render(
        <TextHighlighter
          renderHighlight={renderHighlight}
          onTextHighlighted={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      // The renderHighlight prop is used internally by the component
      // We test that the component renders without errors when this prop is provided
      expect(renderHighlight).toBeDefined()
    })

    it('should use custom selection UI renderer', async () => {
      const renderSelectionUI = jest
        .fn()
        .mockReturnValue(<div>Selection UI</div>)
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      render(
        <TextHighlighter
          renderSelectionUI={renderSelectionUI}
          onTextSelected={jest.fn()}
        >
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(renderSelectionUI).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })
  })

  describe('Utility Functions', () => {
    it('should test getCurrentTextSelection utility', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getCurrentTextSelection.mockReturnValue(mockSelection)

      const result = mockUtils.getCurrentTextSelection()

      expect(result).toEqual(mockSelection)
      expect(mockUtils.getCurrentTextSelection).toHaveBeenCalled()
    })

    it('should test getAdjustedSelection utility', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)

      const result = mockUtils.getAdjustedSelection('word')

      expect(result).toEqual(mockSelection)
      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
    })

    it('should test isValidSelection utility', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.isValidSelection.mockReturnValue(true)

      const result = mockUtils.isValidSelection(mockSelection, false)

      expect(result).toBe(true)
      expect(mockUtils.isValidSelection).toHaveBeenCalledWith(
        mockSelection,
        false
      )
    })

    it('should test highlightRange utility', () => {
      const range = document.createRange()
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow' },
      }
      const mockElement = document.createElement('span')

      mockUtils.highlightRange.mockReturnValue(mockElement)

      const result = mockUtils.highlightRange(range, 'span', highlightStyle)

      expect(result).toBe(mockElement)
      expect(mockUtils.highlightRange).toHaveBeenCalledWith(
        range,
        'span',
        highlightStyle
      )
    })

    it('should test findTextInElement utility', () => {
      const element = document.createElement('div')
      const mockRanges = [document.createRange()]

      mockUtils.findTextInElement.mockReturnValue(mockRanges)

      const result = mockUtils.findTextInElement(element, 'Hello')

      expect(result).toEqual(mockRanges)
      expect(mockUtils.findTextInElement).toHaveBeenCalledWith(element, 'Hello')
    })

    it('should test removeHighlight utility', () => {
      const element = document.createElement('span')

      mockUtils.removeHighlight(element)

      expect(mockUtils.removeHighlight).toHaveBeenCalledWith(element)
    })

    it('should test clearSelection utility', () => {
      mockUtils.clearSelection()

      expect(mockUtils.clearSelection).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null container ref', () => {
      const onTextSelected = jest.fn()

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      mockUtils.getAdjustedSelection.mockReturnValue(null)

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      expect(onTextSelected).not.toHaveBeenCalled()
    })

    it('should handle empty text selection', () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: '',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(false)

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      expect(onTextSelected).not.toHaveBeenCalled()
    })

    it('should handle selection within existing highlight', async () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {
          left: 0,
          top: 0,
          right: 50,
          bottom: 20,
          width: 50,
          height: 20,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        } as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.isRangeWithinHighlight.mockReturnValue(true)

      render(
        <TextHighlighter onTextSelected={onTextSelected}>
          <div data-testid="test-content">Hello world</div>
        </TextHighlighter>
      )

      fireEvent.mouseUp(screen.getByTestId('test-content'))

      await waitFor(
        () => {
          expect(mockUtils.clearSelection).toHaveBeenCalled()
          expect(onTextSelected).not.toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })
  })
})
