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
  createHighlightElement: jest.fn(),
  applyReactElementStyles: jest.fn(),
}))

const mockUtils = utils as jest.Mocked<typeof utils>

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCurrentTextSelection', () => {
    it('should return null when no selection exists', () => {
      mockUtils.getCurrentTextSelection.mockReturnValue(null)

      const result = mockUtils.getCurrentTextSelection()
      expect(result).toBeNull()
    })

    it('should return valid selection when text is selected', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 10, y: 20 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getCurrentTextSelection.mockReturnValue(mockSelection)

      const result = mockUtils.getCurrentTextSelection()

      expect(result).toEqual(mockSelection)
      expect(mockUtils.getCurrentTextSelection).toHaveBeenCalled()
    })
  })

  describe('adjustRangeToWordBoundaries', () => {
    it('should return cloned range when range is collapsed', () => {
      const mockRange = document.createRange()
      const collapsedRange = document.createRange()

      mockUtils.adjustRangeToWordBoundaries.mockReturnValue(collapsedRange)

      const result = mockUtils.adjustRangeToWordBoundaries(mockRange)

      expect(result).toBe(collapsedRange)
      expect(mockUtils.adjustRangeToWordBoundaries).toHaveBeenCalledWith(
        mockRange
      )
    })
  })

  describe('getAdjustedSelection', () => {
    it('should return null when no selection exists', () => {
      mockUtils.getAdjustedSelection.mockReturnValue(null)

      const result = mockUtils.getAdjustedSelection()
      expect(result).toBeNull()
    })

    it('should return original selection for cursor boundary', () => {
      const mockTextSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 10, y: 20 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockTextSelection)

      const result = mockUtils.getAdjustedSelection('cursor')

      expect(result).toEqual(mockTextSelection)
      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('cursor')
    })

    it('should return adjusted selection for word boundary', () => {
      const mockTextSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 10, y: 20 },
        boundingRect: {} as DOMRect,
      }

      mockUtils.getAdjustedSelection.mockReturnValue(mockTextSelection)

      const result = mockUtils.getAdjustedSelection('word')

      expect(result).toEqual(mockTextSelection)
      expect(mockUtils.getAdjustedSelection).toHaveBeenCalledWith('word')
    })
  })

  describe('isSelectionCrossElement', () => {
    it('should return false for same container', () => {
      mockUtils.isSelectionCrossElement.mockReturnValue(false)

      const range = document.createRange()
      const result = mockUtils.isSelectionCrossElement(range)

      expect(result).toBe(false)
      expect(mockUtils.isSelectionCrossElement).toHaveBeenCalledWith(range)
    })

    it('should return true for different containers', () => {
      mockUtils.isSelectionCrossElement.mockReturnValue(true)

      const range = document.createRange()
      const result = mockUtils.isSelectionCrossElement(range)

      expect(result).toBe(true)
      expect(mockUtils.isSelectionCrossElement).toHaveBeenCalledWith(range)
    })
  })

  describe('createHighlightElement', () => {
    it('should create span element by default', () => {
      const mockElement = document.createElement('span')
      mockUtils.createHighlightElement.mockReturnValue(mockElement)

      const element = mockUtils.createHighlightElement('span')

      expect(element).toBe(mockElement)
      expect(mockUtils.createHighlightElement).toHaveBeenCalledWith('span')
    })

    it('should create custom element type', () => {
      const mockElement = document.createElement('mark')
      mockUtils.createHighlightElement.mockReturnValue(mockElement)

      const element = mockUtils.createHighlightElement('mark')

      expect(element).toBe(mockElement)
      expect(mockUtils.createHighlightElement).toHaveBeenCalledWith('mark')
    })

    it('should apply highlight style', () => {
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow' },
      }
      const mockElement = document.createElement('span')
      mockUtils.createHighlightElement.mockReturnValue(mockElement)

      const element = mockUtils.createHighlightElement('span', highlightStyle)

      expect(element).toBe(mockElement)
      expect(mockUtils.createHighlightElement).toHaveBeenCalledWith(
        'span',
        highlightStyle
      )
    })
  })

  describe('highlightRange', () => {
    it('should highlight range with default settings', () => {
      const mockElement = document.createElement('span')
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const range = document.createRange()
      const element = mockUtils.highlightRange(range, 'span')

      expect(element).toBe(mockElement)
      expect(mockUtils.highlightRange).toHaveBeenCalledWith(range, 'span')
    })

    it('should highlight range with custom element and style', () => {
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow' },
      }
      const mockElement = document.createElement('mark')
      mockUtils.highlightRange.mockReturnValue(mockElement)

      const range = document.createRange()
      const element = mockUtils.highlightRange(range, 'mark', highlightStyle)

      expect(element).toBe(mockElement)
      expect(mockUtils.highlightRange).toHaveBeenCalledWith(
        range,
        'mark',
        highlightStyle
      )
    })
  })

  describe('removeHighlight', () => {
    it('should remove highlight element', () => {
      const element = document.createElement('span')

      mockUtils.removeHighlight(element)

      expect(mockUtils.removeHighlight).toHaveBeenCalledWith(element)
    })
  })

  describe('findTextInElement', () => {
    it('should return empty array when text not found', () => {
      mockUtils.findTextInElement.mockReturnValue([])

      const element = document.createElement('div')
      const ranges = mockUtils.findTextInElement(element, 'not found')

      expect(ranges).toEqual([])
      expect(mockUtils.findTextInElement).toHaveBeenCalledWith(
        element,
        'not found'
      )
    })

    it('should find text ranges in element', () => {
      const mockRanges = [document.createRange()]
      mockUtils.findTextInElement.mockReturnValue(mockRanges)

      const element = document.createElement('div')
      const ranges = mockUtils.findTextInElement(element, 'Hello')

      expect(ranges).toEqual(mockRanges)
      expect(mockUtils.findTextInElement).toHaveBeenCalledWith(element, 'Hello')
    })
  })

  describe('clearSelection', () => {
    it('should clear window selection', () => {
      mockUtils.clearSelection()

      expect(mockUtils.clearSelection).toHaveBeenCalled()
    })
  })

  describe('isValidSelection', () => {
    it('should return false for null selection', () => {
      mockUtils.isValidSelection.mockReturnValue(false)

      const result = mockUtils.isValidSelection(null, false)

      expect(result).toBe(false)
      expect(mockUtils.isValidSelection).toHaveBeenCalledWith(null, false)
    })

    it('should return false for empty text', () => {
      mockUtils.isValidSelection.mockReturnValue(false)

      const selection = {
        text: '',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      const result = mockUtils.isValidSelection(selection, false)

      expect(result).toBe(false)
      expect(mockUtils.isValidSelection).toHaveBeenCalledWith(selection, false)
    })

    it('should return false for cross-element selection when not allowed', () => {
      mockUtils.isValidSelection.mockReturnValue(false)

      const selection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      const result = mockUtils.isValidSelection(selection, false)

      expect(result).toBe(false)
      expect(mockUtils.isValidSelection).toHaveBeenCalledWith(selection, false)
    })

    it('should return true for valid selection', () => {
      mockUtils.isValidSelection.mockReturnValue(true)

      const selection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      const result = mockUtils.isValidSelection(selection, false)

      expect(result).toBe(true)
      expect(mockUtils.isValidSelection).toHaveBeenCalledWith(selection, false)
    })
  })

  describe('checkRangeIntersection', () => {
    it('should return false for non-intersecting ranges', () => {
      mockUtils.checkRangeIntersection.mockReturnValue(false)

      const range1 = document.createRange()
      const range2 = document.createRange()

      const result = mockUtils.checkRangeIntersection(range1, range2)

      expect(result).toBe(false)
      expect(mockUtils.checkRangeIntersection).toHaveBeenCalledWith(
        range1,
        range2
      )
    })

    it('should return true for intersecting ranges', () => {
      mockUtils.checkRangeIntersection.mockReturnValue(true)

      const range1 = document.createRange()
      const range2 = document.createRange()

      const result = mockUtils.checkRangeIntersection(range1, range2)

      expect(result).toBe(true)
      expect(mockUtils.checkRangeIntersection).toHaveBeenCalledWith(
        range1,
        range2
      )
    })
  })

  describe('isRangeAlreadyHighlighted', () => {
    it('should return false for non-highlighted range', () => {
      mockUtils.isRangeAlreadyHighlighted.mockReturnValue(false)

      const highlights = new Map()
      const range = document.createRange()

      const result = mockUtils.isRangeAlreadyHighlighted(range, highlights)

      expect(result).toBe(false)
      expect(mockUtils.isRangeAlreadyHighlighted).toHaveBeenCalledWith(
        range,
        highlights
      )
    })

    it('should return true for already highlighted range', () => {
      mockUtils.isRangeAlreadyHighlighted.mockReturnValue(true)

      const highlights = new Map([
        [
          'id1',
          {
            element: document.createElement('span'),
            selection: {
              text: 'Hello',
              range: document.createRange(),
              position: { x: 0, y: 0 },
              boundingRect: {} as DOMRect,
            },
          },
        ],
      ])
      const range = document.createRange()

      const result = mockUtils.isRangeAlreadyHighlighted(range, highlights)

      expect(result).toBe(true)
      expect(mockUtils.isRangeAlreadyHighlighted).toHaveBeenCalledWith(
        range,
        highlights
      )
    })
  })

  describe('isRangeWithinHighlight', () => {
    it('should return false when no container element', () => {
      mockUtils.isRangeWithinHighlight.mockReturnValue(false)

      const range = document.createRange()
      const result = mockUtils.isRangeWithinHighlight(range, null as any)

      expect(result).toBe(false)
      expect(mockUtils.isRangeWithinHighlight).toHaveBeenCalledWith(range, null)
    })

    it('should return false when range is not within highlight', () => {
      mockUtils.isRangeWithinHighlight.mockReturnValue(false)

      const container = document.createElement('div')
      const range = document.createRange()

      const result = mockUtils.isRangeWithinHighlight(range, container)

      expect(result).toBe(false)
      expect(mockUtils.isRangeWithinHighlight).toHaveBeenCalledWith(
        range,
        container
      )
    })
  })

  describe('applyReactElementStyles', () => {
    it('should apply className to DOM element', () => {
      const reactElement = {
        props: {
          className: 'test-class',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should apply inline styles to DOM element', () => {
      const reactElement = {
        props: {
          style: { backgroundColor: 'yellow', color: 'black' },
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should apply title attribute to DOM element', () => {
      const reactElement = {
        props: {
          title: 'Test title',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should apply onClick handler and set cursor style', () => {
      const reactElement = {
        props: {
          onClick: jest.fn(),
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should apply data attributes to DOM element', () => {
      const reactElement = {
        props: {
          'data-testid': 'test-element',
          'data-highlight': 'true',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should handle string children', () => {
      const reactElement = {
        props: {
          children: 'Test content',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })

    it('should handle array children', () => {
      const reactElement = {
        props: {
          children: ['Hello', ' ', 'World', 123],
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      mockUtils.applyReactElementStyles(reactElement, domElement)

      expect(mockUtils.applyReactElementStyles).toHaveBeenCalledWith(
        reactElement,
        domElement
      )
    })
  })

  describe('isSelectionCrossElement', () => {
    it('should return false for single element selection', () => {
      const range = document.createRange()
      mockUtils.isSelectionCrossElement.mockReturnValue(false)

      const result = mockUtils.isSelectionCrossElement(range)

      expect(result).toBe(false)
      expect(mockUtils.isSelectionCrossElement).toHaveBeenCalledWith(range)
    })

    it('should return true for cross element selection', () => {
      const range = document.createRange()
      mockUtils.isSelectionCrossElement.mockReturnValue(true)

      const result = mockUtils.isSelectionCrossElement(range)

      expect(result).toBe(true)
      expect(mockUtils.isSelectionCrossElement).toHaveBeenCalledWith(range)
    })
  })

  describe('adjustRangeToWordBoundaries', () => {
    it('should adjust range to word boundaries', () => {
      const range = document.createRange()
      const adjustedRange = document.createRange()
      mockUtils.adjustRangeToWordBoundaries.mockReturnValue(adjustedRange)

      const result = mockUtils.adjustRangeToWordBoundaries(range)

      expect(result).toBe(adjustedRange)
      expect(mockUtils.adjustRangeToWordBoundaries).toHaveBeenCalledWith(range)
    })
  })

  describe('getCurrentTextSelection', () => {
    it('should return current text selection', () => {
      const mockSelection = {
        text: 'Hello',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }
      mockUtils.getCurrentTextSelection.mockReturnValue(mockSelection)

      const result = mockUtils.getCurrentTextSelection()

      expect(result).toBe(mockSelection)
      expect(mockUtils.getCurrentTextSelection).toHaveBeenCalled()
    })

    it('should return null when no selection', () => {
      mockUtils.getCurrentTextSelection.mockReturnValue(null)

      const result = mockUtils.getCurrentTextSelection()

      expect(result).toBeNull()
      expect(mockUtils.getCurrentTextSelection).toHaveBeenCalled()
    })
  })
})
