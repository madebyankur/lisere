import type { HighlightStyle, SelectionBoundary, TextSelection } from './types'

const highlightElementCache = new Map<HTMLElement, Set<HTMLElement>>()

/**
 * Get the current text selection from the window
 * @returns TextSelection object with selection details, or null if no valid selection exists
 * @example
 * ```typescript
 * const selection = getCurrentTextSelection()
 * if (selection) {
 *   console.log('Selected text:', selection.text)
 * }
 * ```
 */
export const getCurrentTextSelection = (): TextSelection | null => {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null
  }

  const range = selection.getRangeAt(0)
  const selectedText = range.toString().trim()

  if (!selectedText) {
    return null
  }

  const boundingRect = range.getBoundingClientRect()

  return {
    text: selectedText,
    range: range.cloneRange(),
    position: {
      x: boundingRect.left + window.scrollX,
      y: boundingRect.top + window.scrollY,
    },
    boundingRect,
  }
}

/**
 * Adjust range to word boundaries for more natural highlighting
 * @param range - The DOM range to adjust
 * @returns A new range adjusted to word boundaries
 * @example
 * ```typescript
 * const range = document.createRange()
 * range.selectNodeContents(element)
 * const adjustedRange = adjustRangeToWordBoundaries(range)
 * ```
 */
export const adjustRangeToWordBoundaries = (range: Range): Range => {
  const newRange = range.cloneRange()

  if (range.collapsed) {
    return newRange
  }

  const startContainer = range.startContainer
  const endContainer = range.endContainer
  let startOffset = range.startOffset
  let endOffset = range.endOffset

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textBefore = (startContainer.textContent || '').slice(0, startOffset)
    const lastSpaceIndex = textBefore.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
      startOffset = lastSpaceIndex + 1
    } else {
      startOffset = 0
    }
  }

  if (endContainer.nodeType === Node.TEXT_NODE) {
    const textAfter = (endContainer.textContent || '').slice(endOffset)
    const firstSpaceIndex = textAfter.indexOf(' ')
    if (firstSpaceIndex !== -1) {
      endOffset += firstSpaceIndex
    } else {
      endOffset = (endContainer.textContent || '').length
    }
  }

  newRange.setStart(startContainer, startOffset)
  newRange.setEnd(endContainer, endOffset)

  return newRange
}

/**
 * Get text selection with boundary adjustment based on selection boundary setting
 * @param selectionBoundary - How to handle selection boundaries ('cursor' or 'word')
 * @returns Adjusted TextSelection or null if no valid selection
 * @example
 * ```typescript
 * const selection = getAdjustedSelection('word')
 * if (selection) {
 *   highlightRange(selection.range)
 * }
 * ```
 */
export const getAdjustedSelection = (
  selectionBoundary: SelectionBoundary = 'word'
): TextSelection | null => {
  const selection = getCurrentTextSelection()
  if (!selection) return null

  if (selectionBoundary === 'cursor') {
    return selection
  }

  const adjustedRange = adjustRangeToWordBoundaries(selection.range)
  const adjustedText = adjustedRange.toString().trim()

  if (!adjustedText) return null

  const boundingRect = adjustedRange.getBoundingClientRect()

  return {
    text: adjustedText,
    range: adjustedRange,
    position: {
      x: boundingRect.left + window.scrollX,
      y: boundingRect.top + window.scrollY,
    },
    boundingRect,
  }
}

/**
 * Check if selection spans across multiple elements
 * @param range - The DOM range to check
 * @returns True if selection crosses element boundaries
 * @example
 * ```typescript
 * const isCrossElement = isSelectionCrossElement(range)
 * if (isCrossElement && !allowCrossElementSelection) {
 *   // Handle cross-element selection
 * }
 * ```
 */
export const isSelectionCrossElement = (range: Range): boolean => {
  return range.startContainer !== range.endContainer
}

/**
 * Create a highlight element with the specified style
 * @param elementType - The HTML element type to create (default: 'span')
 * @param highlightStyle - Optional styling configuration
 * @returns The created highlight element
 * @example
 * ```typescript
 * const highlightEl = createHighlightElement('mark', {
 *   className: 'custom-highlight',
 *   style: { backgroundColor: '#ffeb3b' }
 * })
 * ```
 */
export const createHighlightElement = (
  elementType: string = 'span',
  highlightStyle?: HighlightStyle
): HTMLElement => {
  const element = document.createElement(elementType)

  if (highlightStyle?.className) {
    element.className = highlightStyle.className
  }

  if (highlightStyle?.style) {
    Object.assign(element.style, highlightStyle.style)
  }

  if (!highlightStyle?.className && !highlightStyle?.style) {
    element.style.userSelect = 'text'
    element.style.backgroundColor = '#f5f5f4'
    element.style.color = '#0c0a09'
    element.style.padding = '0px'
    element.style.outline = '1px solid #fafaf9'
    element.style.boxShadow =
      '0 0 0 2px rgba(0,0,0,0.1), 0 1px 2px 1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1), inset 0 -1px 1px -2px rgba(0,0,0,0.1), inset 0 0.5px 1px -2px rgba(255,255,255,0.1)'
    element.style.borderRadius = '5px'
    element.style.display = 'inline'
  } else {
    if (!highlightStyle?.style?.display) {
      element.style.display = 'inline'
    }
  }

  return element
}

/**
 * Highlight a text range by wrapping it in a highlight element
 * @param range - The DOM range to highlight
 * @param elementType - The element type to use for highlighting (default: 'span')
 * @param highlightStyle - Optional styling for the highlight
 * @returns The created highlight element
 * @example
 * ```typescript
 * const range = document.createRange()
 * range.selectNodeContents(textNode)
 * const highlightEl = highlightRange(range, 'span', {
 *   className: 'highlight',
 *   style: { backgroundColor: 'yellow' }
 * })
 * ```
 */
export const highlightRange = (
  range: Range,
  elementType: string = 'span',
  highlightStyle?: HighlightStyle
): HTMLElement => {
  const highlightElement = createHighlightElement(elementType, highlightStyle)

  try {
    range.surroundContents(highlightElement)
  } catch {
    const fragment = range.extractContents()
    highlightElement.appendChild(fragment)
    range.insertNode(highlightElement)
  }

  return highlightElement
}

/**
 * Remove a highlight element and restore the original text
 * @param highlightElement - The highlight element to remove
 * @example
 * ```typescript
 * const highlightEl = document.querySelector('.highlight')
 * if (highlightEl) {
 *   removeHighlight(highlightEl)
 * }
 * ```
 */
export const removeHighlight = (highlightElement: HTMLElement): void => {
  const parent = highlightElement.parentNode
  if (!parent) return

  // Move all children back to parent
  while (highlightElement.firstChild) {
    parent.insertBefore(highlightElement.firstChild, highlightElement)
  }

  parent.removeChild(highlightElement)

  // Normalize text nodes to merge adjacent text nodes
  parent.normalize()

  highlightElementCache.delete(highlightElement)
}

/**
 * Find all occurrences of text in an element and return their ranges
 * @param element - The element to search within
 * @param text - The text to search for
 * @returns Array of DOM ranges for each occurrence
 * @example
 * ```typescript
 * const container = document.getElementById('content')
 * const ranges = findTextInElement(container, 'search term')
 * ranges.forEach(range => {
 *   highlightRange(range)
 * })
 * ```
 */
export const findTextInElement = (
  element: HTMLElement,
  text: string
): Range[] => {
  const ranges: Range[] = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)

  let node: Node | null
  while ((node = walker.nextNode())) {
    const textContent = node.textContent || ''
    let index = 0

    while ((index = textContent.indexOf(text, index)) !== -1) {
      const range = document.createRange()
      range.setStart(node, index)
      range.setEnd(node, index + text.length)
      ranges.push(range)
      index += text.length
    }
  }

  return ranges
}

/**
 * Clear the current text selection
 * @example
 * ```typescript
 * highlightRange(range)
 * clearSelection()
 * ```
 */
export const clearSelection = (): void => {
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
  }
}

/**
 * Validate if a selection is valid for highlighting
 * @param selection - The text selection to validate
 * @param allowCrossElement - Whether cross-element selections are allowed
 * @returns True if the selection is valid for highlighting
 * @example
 * ```typescript
 * const selection = getCurrentTextSelection()
 * if (isValidSelection(selection, false)) {
 *   highlightRange(selection.range)
 * }
 * ```
 */
export const isValidSelection = (
  selection: TextSelection | null,
  allowCrossElement: boolean = false
): boolean => {
  if (!selection) return false

  if (!selection.text.trim()) {
    return false
  }

  if (!allowCrossElement && isSelectionCrossElement(selection.range)) {
    return false
  }

  return true
}

/**
 * Check if two ranges intersect or overlap
 * @param range1 - First DOM range
 * @param range2 - Second DOM range
 * @returns True if ranges intersect
 * @example
 * ```typescript
 * const range1 = document.createRange()
 * const range2 = document.createRange()
 * if (checkRangeIntersection(range1, range2)) {
 *   console.log('Ranges overlap')
 * }
 * ```
 */
export const checkRangeIntersection = (
  range1: Range,
  range2: Range
): boolean => {
  try {
    if (
      range1.commonAncestorContainer.ownerDocument !==
      range2.commonAncestorContainer.ownerDocument
    ) {
      return false
    }

    const range1StartsAfterRange2Ends =
      range1.compareBoundaryPoints(Range.START_TO_END, range2) >= 0
    const range2StartsAfterRange1Ends =
      range2.compareBoundaryPoints(Range.START_TO_END, range1) >= 0

    return !(range1StartsAfterRange2Ends || range2StartsAfterRange1Ends)
  } catch {
    return false
  }
}

/**
 * Check if a range intersects with any existing highlights (optimized)
 * @param range - The DOM range to check
 * @param existingHighlights - Map of existing highlights
 * @returns True if range is already highlighted
 * @example
 * ```typescript
 * const range = document.createRange()
 * const isHighlighted = isRangeAlreadyHighlighted(range, highlightsMap)
 * if (!isHighlighted) {
 *   highlightRange(range)
 * }
 * ```
 */
export const isRangeAlreadyHighlighted = (
  range: Range,
  existingHighlights: Map<
    string,
    { element: HTMLElement; selection: TextSelection; temporary?: boolean }
  >
): boolean => {
  if (existingHighlights.size === 0) return false

  for (const [, highlight] of existingHighlights) {
    if (highlight.temporary) continue

    if (checkRangeIntersection(range, highlight.selection.range)) {
      return true
    }
  }
  return false
}

/**
 * Check if a range is completely contained within a highlighted element
 * @param range - The DOM range to check
 * @param containerElement - The container element to search within
 * @returns True if range is within an existing highlight
 * @example
 * ```typescript
 * const range = document.createRange()
 * const container = document.getElementById('content')
 * const isWithinHighlight = isRangeWithinHighlight(range, container)
 * if (isWithinHighlight) {
 *   console.log('Range is already highlighted')
 * }
 * ```
 */
export const isRangeWithinHighlight = (
  range: Range,
  containerElement: HTMLElement
): boolean => {
  try {
    const cachedHighlights = highlightElementCache.get(containerElement)
    if (cachedHighlights) {
      for (const highlightElement of cachedHighlights) {
        if (isRangeContainedInElement(range, highlightElement)) {
          return true
        }
      }
    }

    const { highlights: foundHighlights, isContained } =
      findHighlightElementsInRange(range, containerElement)

    if (foundHighlights.size > 0) {
      updateHighlightCache(containerElement, foundHighlights, cachedHighlights)
    }

    return isContained
  } catch {
    return false
  }
}

/**
 * Check if a range is completely contained within a specific element
 * @param range - The DOM range to check
 * @param element - The element to check against
 * @returns True if the range is completely within the element
 */
const isRangeContainedInElement = (
  range: Range,
  element: HTMLElement
): boolean => {
  if (
    !element.contains(range.startContainer) ||
    !element.contains(range.endContainer)
  ) {
    return false
  }

  const highlightRange = document.createRange()
  highlightRange.selectNodeContents(element)

  const rangeStartWithinHighlight =
    highlightRange.comparePoint(range.startContainer, range.startOffset) <= 0
  const rangeEndWithinHighlight =
    highlightRange.comparePoint(range.endContainer, range.endOffset) >= 0

  highlightRange.detach()

  return rangeStartWithinHighlight && rangeEndWithinHighlight
}

/**
 * Find all highlight elements that contain the given range
 * @param range - The DOM range to search for
 * @param containerElement - The container to search within
 * @returns Set of highlight elements found and whether range is contained
 */
const findHighlightElementsInRange = (
  range: Range,
  containerElement: HTMLElement
): { highlights: Set<HTMLElement>; isContained: boolean } => {
  const foundHighlights = new Set<HTMLElement>()
  let isContained = false

  let node: Node | null = range.startContainer

  while (node && node !== containerElement) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement

      if (element.hasAttribute('data-highlight-id')) {
        foundHighlights.add(element)

        if (!isContained && isRangeContainedInElement(range, element)) {
          isContained = true
        }
      }
    }

    node = node.parentNode
  }

  return { highlights: foundHighlights, isContained }
}

/**
 * Update the highlight cache with new elements
 * @param containerElement - The container element
 * @param foundHighlights - New highlight elements found
 * @param existingCache - Existing cache if any
 */
const updateHighlightCache = (
  containerElement: HTMLElement,
  foundHighlights: Set<HTMLElement>,
  existingCache?: Set<HTMLElement>
): void => {
  if (existingCache) {
    foundHighlights.forEach(highlight => existingCache.add(highlight))
  } else {
    highlightElementCache.set(containerElement, foundHighlights)
  }
}

/**
 * Extract styles and attributes from a React element and apply them to a DOM element
 * @param reactElement - The React element to extract styles from
 * @param domElement - The DOM element to apply styles to
 * @example
 * ```typescript
 * const reactElement = <span className="highlight" style={{ color: 'red' }}>Text</span>
 * const domElement = document.createElement('span')
 * applyReactElementStyles(reactElement, domElement)
 * ```
 */
export const applyReactElementStyles = (
  reactElement: React.ReactElement,
  domElement: HTMLElement
): void => {
  const props = reactElement.props as React.HTMLAttributes<HTMLElement>

  if (props.className) {
    domElement.className = props.className
  }

  if (props.style) {
    Object.assign(domElement.style, props.style)
  }

  if (props.title) {
    domElement.setAttribute('title', props.title)
  }

  if (props.onClick) {
    domElement.style.cursor = 'pointer'
  }

  Object.keys(props).forEach(key => {
    if (key.startsWith('data-')) {
      domElement.setAttribute(key, props[key as keyof typeof props])
    }
  })

  if (props.children) {
    if (typeof props.children === 'string') {
      domElement.textContent = props.children
    } else if (Array.isArray(props.children)) {
      const textContent = props.children
        .map((child: React.ReactNode) => {
          if (typeof child === 'string') return child
          if (typeof child === 'number') return child.toString()
          return ''
        })
        .join('')
      domElement.textContent = textContent
    }
  }
}
