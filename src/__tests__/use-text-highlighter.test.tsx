import React, { RefObject } from 'react'
import { renderHook, act } from '@testing-library/react'
import { useTextHighlighter } from '../use-text-highlighter'
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

describe('useTextHighlighter Hook', () => {
  let containerRef: React.RefObject<HTMLDivElement>

  beforeEach(() => {
    jest.clearAllMocks()
    containerRef = { current: document.createElement('div') }

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

  describe('Basic Hook Functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useTextHighlighter({ containerRef }))

      expect(result.current.selection).toBeNull()
      expect(result.current.highlights).toEqual([])
      expect(typeof result.current.highlightText).toBe('function')
      expect(typeof result.current.removeHighlight).toBe('function')
      expect(typeof result.current.clearHighlights).toBe('function')
      expect(typeof result.current.getCurrentTextSelection).toBe('function')
    })

    it('should handle disabled state', () => {
      const onTextSelected = jest.fn()
      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          enabled: false,
          onTextSelected,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).not.toHaveBeenCalled()
      expect(onTextSelected).not.toHaveBeenCalled()
    })

    it('should handle null container ref', () => {
      const nullRef = { current: null } as unknown as RefObject<HTMLElement>
      const { result } = renderHook(() =>
        useTextHighlighter({ containerRef: nullRef })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).not.toHaveBeenCalled()
    })
  })

  describe('Text Selection Handling', () => {
    it('should handle valid text selection', async () => {
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

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextSelected,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
      expect(onTextSelected).not.toHaveBeenCalled() // Only called on mouseup event
    })

    it('should handle invalid selection', () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(false)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextSelected,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(result.current.selection).toBeNull()
    })

    it('should handle already highlighted selection', () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.isRangeAlreadyHighlighted.mockReturnValue(true)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextSelected,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.clearSelection).not.toHaveBeenCalled() // Only called on mouseup event
    })

    it('should handle selection within highlight', () => {
      const onTextSelected = jest.fn()
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)
      mockUtils.isRangeWithinHighlight.mockReturnValue(true)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextSelected,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.clearSelection).not.toHaveBeenCalled() // Only called on mouseup event
    })
  })

  describe('Manual Text Highlighting', () => {
    it('should highlight text in container', () => {
      const onTextHighlighted = jest.fn()
      const mockRange = document.createRange()
      const mockElement = document.createElement('span')

      mockUtils.findTextInElement.mockReturnValue([mockRange])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(mockUtils.findTextInElement).toHaveBeenCalledWith(
        containerRef.current,
        'Hello'
      )
      expect(mockUtils.highlightRange).toHaveBeenCalledWith(
        mockRange,
        'span',
        undefined
      )
      expect(onTextHighlighted).toHaveBeenCalled()
    })

    it('should highlight text with custom element and style', () => {
      const onTextHighlighted = jest.fn()
      const mockRange = document.createRange()
      const mockElement = document.createElement('mark')
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow' },
      }

      mockUtils.findTextInElement.mockReturnValue([mockRange])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          highlightElement: 'mark',
          highlightStyle,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(mockUtils.highlightRange).toHaveBeenCalledWith(
        mockRange,
        'mark',
        highlightStyle
      )
    })

    it('should highlight text in specific element selector', () => {
      const onTextHighlighted = jest.fn()
      const mockRange = document.createRange()
      const mockElement = document.createElement('span')
      const targetElement = document.createElement('p')

      containerRef.current!.appendChild(targetElement)
      mockUtils.findTextInElement.mockReturnValue([mockRange])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello', 'p')
      })

      expect(mockUtils.findTextInElement).toHaveBeenCalledWith(
        targetElement,
        'Hello'
      )
    })

    it('should skip already highlighted ranges', () => {
      const onTextHighlighted = jest.fn()
      const mockRange = document.createRange()

      mockUtils.findTextInElement.mockReturnValue([mockRange])
      mockUtils.isRangeAlreadyHighlighted.mockReturnValue(true)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(mockUtils.highlightRange).not.toHaveBeenCalled()
      expect(onTextHighlighted).not.toHaveBeenCalled()
    })

    it('should skip ranges within existing highlights', () => {
      const onTextHighlighted = jest.fn()
      const mockRange = document.createRange()

      mockUtils.findTextInElement.mockReturnValue([mockRange])
      mockUtils.isRangeWithinHighlight.mockReturnValue(true)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(mockUtils.highlightRange).not.toHaveBeenCalled()
      expect(onTextHighlighted).not.toHaveBeenCalled()
    })

    it('should handle multiple ranges', () => {
      const onTextHighlighted = jest.fn()
      const mockRange1 = document.createRange()
      const mockRange2 = document.createRange()
      const mockElement = document.createElement('span')

      mockUtils.findTextInElement.mockReturnValue([mockRange1, mockRange2])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onTextHighlighted,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(mockUtils.highlightRange).toHaveBeenCalledTimes(2)
      expect(onTextHighlighted).toHaveBeenCalledTimes(2)
    })
  })

  describe('Highlight Removal', () => {
    it('should remove specific highlight', () => {
      const onHighlightRemoved = jest.fn()
      const mockElement = document.createElement('span')
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.findTextInElement.mockReturnValue([document.createRange()])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onHighlightRemoved,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      act(() => {
        result.current.removeHighlight(mockSelection)
      })

      expect(mockUtils.removeHighlight).toHaveBeenCalled()
    })

    it('should clear all highlights', () => {
      const onHighlightRemoved = jest.fn()
      const mockElement = document.createElement('span')

      mockUtils.findTextInElement.mockReturnValue([document.createRange()])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onHighlightRemoved,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      act(() => {
        result.current.clearHighlights()
      })

      expect(mockUtils.removeHighlight).toHaveBeenCalled()
      expect(onHighlightRemoved).toHaveBeenCalled()
      expect(result.current.highlights).toEqual([])
    })

    it('should handle error during highlight removal', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const onHighlightRemoved = jest.fn()
      const mockElement = document.createElement('span')

      mockUtils.findTextInElement.mockReturnValue([document.createRange()])
      mockUtils.highlightRange.mockReturnValue(mockElement)
      mockUtils.removeHighlight.mockImplementation(() => {
        throw new Error('Removal failed')
      })

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          onHighlightRemoved,
        })
      )

      act(() => {
        result.current.highlightText('Hello')
      })

      act(() => {
        result.current.clearHighlights()
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error removing highlight:',
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe('Selection Boundary', () => {
    it('should use cursor boundary', () => {
      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          selectionBoundary: 'cursor',
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('cursor')
    })

    it('should use word boundary', () => {
      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          selectionBoundary: 'word',
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
    })
  })

  describe('Cross Element Selection', () => {
    it('should allow cross element selection when enabled', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          allowCrossElementSelection: true,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
    })

    it('should disallow cross element selection when disabled', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(false)

      const { result } = renderHook(() =>
        useTextHighlighter({
          containerRef,
          allowCrossElementSelection: false,
        })
      )

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
    })
  })

  describe('Event Listeners', () => {
    it('should add mouseup event listener when enabled', () => {
      const addEventListenerSpy = jest.spyOn(
        containerRef.current!,
        'addEventListener'
      )
      const removeEventListenerSpy = jest.spyOn(
        containerRef.current!,
        'removeEventListener'
      )

      const { unmount } = renderHook(() =>
        useTextHighlighter({ containerRef, enabled: true })
      )

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      )
    })

    it('should not add event listener when disabled', () => {
      const addEventListenerSpy = jest.spyOn(
        containerRef.current!,
        'addEventListener'
      )

      renderHook(() => useTextHighlighter({ containerRef, enabled: false }))

      expect(addEventListenerSpy).not.toHaveBeenCalled()
    })

    it('should not add event listener when container ref is null', () => {
      const nullRef = { current: null } as unknown as RefObject<HTMLElement>

      renderHook(() => useTextHighlighter({ containerRef: nullRef }))

      expect(mockUtils.getAdjustedSelection).not.toHaveBeenCalled()
    })
  })

  describe('Return Values', () => {
    it('should return current text selection', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockSelection)
      mockUtils.isValidSelection.mockReturnValue(true)

      const { result } = renderHook(() => useTextHighlighter({ containerRef }))

      act(() => {
        result.current.getCurrentTextSelection()
      })

      expect(result.current.selection).toBeNull() // Only set on mouseup event
    })

    it('should return highlights array', () => {
      const mockElement = document.createElement('span')

      mockUtils.findTextInElement.mockReturnValue([document.createRange()])
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const { result } = renderHook(() => useTextHighlighter({ containerRef }))

      act(() => {
        result.current.highlightText('Hello')
      })

      expect(Array.isArray(result.current.highlights)).toBe(true)
      expect(result.current.highlights.length).toBeGreaterThan(0)
    })
  })
})
