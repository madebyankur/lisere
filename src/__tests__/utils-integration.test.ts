import {
  getCurrentTextSelection,
  getAdjustedSelection,
  isValidSelection,
  isRangeAlreadyHighlighted,
  isRangeWithinHighlight,
  findTextInElement,
  adjustRangeToWordBoundaries,
  isSelectionCrossElement,
  checkRangeIntersection,
  applyReactElementStyles,
  createHighlightElement,
} from '../utils'

describe('Utils Integration Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `
      <p>This is a test paragraph with some text to highlight.</p>
      <p>Another paragraph with different content.</p>
      <div class="nested">
        <span>Nested text content</span>
      </div>
    `
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container)
    }
  })

  describe('getCurrentTextSelection', () => {
    it('should return null when no selection exists', () => {
      const result = getCurrentTextSelection()
      expect(result).toBeNull()
    })
  })

  describe('adjustRangeToWordBoundaries', () => {
    it('should handle collapsed range', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 5)
      range.setEnd(textNode, 5)

      const adjustedRange = adjustRangeToWordBoundaries(range)

      expect(adjustedRange).toBeDefined()
      expect(adjustedRange.collapsed).toBe(true)
    })
  })

  describe('getAdjustedSelection', () => {
    it('should return null when no selection exists', () => {
      const result = getAdjustedSelection()
      expect(result).toBeNull()
    })

    it('should return null for cursor boundary when no selection', () => {
      const result = getAdjustedSelection('cursor')
      expect(result).toBeNull()
    })

    it('should return null for word boundary when no selection', () => {
      const result = getAdjustedSelection('word')
      expect(result).toBeNull()
    })
  })

  describe('isSelectionCrossElement', () => {
    it('should return false for single element selection', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 10)

      const result = isSelectionCrossElement(range)
      expect(result).toBe(false)
    })
  })

  describe('createHighlightElement', () => {
    it('should apply highlight style', () => {
      const highlightStyle = {
        className: 'custom-highlight',
        style: { backgroundColor: 'yellow', color: 'black' },
      }

      const element = createHighlightElement('span', highlightStyle)
      expect(element.className).toBe('custom-highlight')
      expect(element.style.backgroundColor).toBe('yellow')
      expect(element.style.color).toBe('black')
    })
  })

  describe('findTextInElement', () => {
    it('should return empty array when text not found', () => {
      const ranges = findTextInElement(container, 'nonexistent')
      expect(ranges).toEqual([])
    })

    it('should find text ranges in element', () => {
      const ranges = findTextInElement(container, 'test')
      expect(ranges.length).toBeGreaterThan(0)
      expect(ranges[0]).toBeInstanceOf(Range)
    })

    it('should find multiple occurrences', () => {
      const ranges = findTextInElement(container, 'paragraph')
      expect(ranges.length).toBeGreaterThan(0)
    })
  })

  describe('isValidSelection', () => {
    it('should return false for null selection', () => {
      const result = isValidSelection(null)
      expect(result).toBe(false)
    })

    it('should return false for empty text', () => {
      const selection = {
        text: '',
        range: document.createRange(),
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      const result = isValidSelection(selection)
      expect(result).toBe(false)
    })

    it('should return true for valid selection', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 4)

      const selection = {
        text: 'This',
        range,
        position: { x: 0, y: 0 },
        boundingRect: {} as DOMRect,
      }

      const result = isValidSelection(selection)
      expect(result).toBe(true)
    })
  })

  describe('checkRangeIntersection', () => {
    it('should return false for non-intersecting ranges', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range1 = document.createRange()
      range1.setStart(textNode, 0)
      range1.setEnd(textNode, 4)

      const range2 = document.createRange()
      range2.setStart(textNode, 10)
      range2.setEnd(textNode, 14)

      const result = checkRangeIntersection(range1, range2)
      expect(result).toBe(false)
    })
  })

  describe('isRangeAlreadyHighlighted', () => {
    it('should return false for non-highlighted range', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 4)

      const highlights = new Map()
      const result = isRangeAlreadyHighlighted(range, highlights)
      expect(result).toBe(false)
    })
  })

  describe('isRangeWithinHighlight', () => {
    it('should return false when no container element', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 4)

      const result = isRangeWithinHighlight(range, null as any)
      expect(result).toBe(false)
    })

    it('should return false when range is not within highlight', () => {
      const textNode = container.querySelector('p')!.firstChild!
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 4)

      const result = isRangeWithinHighlight(range, container)
      expect(result).toBe(false)
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

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.className).toBe('test-class')
    })

    it('should apply inline styles to DOM element', () => {
      const reactElement = {
        props: {
          style: { backgroundColor: 'yellow', color: 'black' },
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.style.backgroundColor).toBe('yellow')
      expect(domElement.style.color).toBe('black')
    })

    it('should apply title attribute to DOM element', () => {
      const reactElement = {
        props: {
          title: 'Test title',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.getAttribute('title')).toBe('Test title')
    })

    it('should apply onClick handler and set cursor style', () => {
      const reactElement = {
        props: {
          onClick: jest.fn(),
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.style.cursor).toBe('pointer')
    })

    it('should apply data attributes to DOM element', () => {
      const reactElement = {
        props: {
          'data-testid': 'test-element',
          'data-highlight': 'true',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.getAttribute('data-testid')).toBe('test-element')
      expect(domElement.getAttribute('data-highlight')).toBe('true')
    })

    it('should handle string children', () => {
      const reactElement = {
        props: {
          children: 'Test content',
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.textContent).toBe('Test content')
    })

    it('should handle array children', () => {
      const reactElement = {
        props: {
          children: ['Hello', ' ', 'World', 123],
        },
      } as React.ReactElement
      const domElement = document.createElement('div')

      applyReactElementStyles(reactElement, domElement)
      expect(domElement.textContent).toBe('Hello World123')
    })
  })
})
