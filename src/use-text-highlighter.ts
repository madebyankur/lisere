import { useCallback, useEffect, useState } from 'react'

import type {
  TextSelection,
  UseTextHighlighterProps,
  UseTextHighlighterReturn,
} from './types'
import {
  clearSelection,
  findTextInElement,
  getAdjustedSelection,
  highlightRange,
  isRangeAlreadyHighlighted,
  isRangeWithinHighlight,
  isValidSelection,
  removeHighlight as removeHighlightFromDOM,
} from './utils'

/**
 * Hook for programmatic text highlighting control
 *
 * This hook provides a more flexible API for text highlighting compared to the
 * TextHighlighter component. It gives you direct control over when and how
 * text is highlighted, making it ideal for complex use cases.
 *
 * @param props - Configuration options for the hook
 * @returns Object containing highlighting state and methods
 *
 * @example
 * ```typescript
 * const containerRef = useRef<HTMLDivElement>(null)
 * const { highlights, highlightText, clearHighlights } = useTextHighlighter({
 *   containerRef,
 *   highlightStyle: { className: 'custom-highlight' },
 *   onTextHighlighted: (selection) => {
 *     console.log('Highlighted:', selection.text)
 *   }
 * })
 *
 * highlightText('search term')
 *
 * clearHighlights()
 * ```
 */
export const useTextHighlighter = ({
  containerRef,
  enabled = true,
  selectionBoundary = 'word',
  highlightStyle,
  highlightElement = 'span',
  allowCrossElementSelection = false,
  onTextSelected,
  onTextHighlighted,
  onHighlightRemoved,
}: UseTextHighlighterProps): UseTextHighlighterReturn => {
  const [currentSelection, setCurrentSelection] =
    useState<TextSelection | null>(null)
  const [highlights, setHighlights] = useState<
    Map<string, { element: HTMLElement; selection: TextSelection }>
  >(new Map())

  const handleTextSelection = useCallback(() => {
    if (!enabled || !containerRef.current) return

    const selection = getAdjustedSelection(selectionBoundary)

    if (!isValidSelection(selection, allowCrossElementSelection)) {
      setCurrentSelection(null)
      return
    }

    if (
      isRangeAlreadyHighlighted(selection!.range, highlights) ||
      isRangeWithinHighlight(selection!.range, containerRef.current)
    ) {
      clearSelection()
      setCurrentSelection(null)
      return
    }

    setCurrentSelection(selection)

    if (onTextSelected) {
      onTextSelected(selection!)
    }
  }, [
    enabled,
    selectionBoundary,
    allowCrossElementSelection,
    highlights,
    onTextSelected,
    containerRef,
  ])

  /**
   * Get the current text selection without creating a highlight
   * @returns Current TextSelection or null if no valid selection exists
   */
  const getCurrentTextSelection = useCallback((): TextSelection | null => {
    if (!enabled || !containerRef.current) return null
    return getAdjustedSelection(selectionBoundary)
  }, [enabled, selectionBoundary, containerRef])

  /**
   * Programmatically highlight text within the container
   * @param text - The text to highlight
   * @param elementSelector - Optional CSS selector to limit search scope
   */
  const highlightText = useCallback(
    (text: string, elementSelector?: string) => {
      if (!containerRef.current) return

      let targetElement = containerRef.current
      if (elementSelector) {
        const selected = containerRef.current.querySelector(elementSelector)
        if (selected instanceof HTMLElement) {
          targetElement = selected
        }
      }

      const ranges = findTextInElement(targetElement, text)
      ranges.forEach(range => {
        if (
          isRangeAlreadyHighlighted(range, highlights) ||
          isRangeWithinHighlight(range, containerRef.current!)
        ) {
          return
        }

        const selection: TextSelection = {
          text,
          range: range.cloneRange(),
          position: {
            x: range.getBoundingClientRect().left + window.scrollX,
            y: range.getBoundingClientRect().top + window.scrollY,
          },
          boundingRect: range.getBoundingClientRect(),
        }

        const highlightId = `manual-${Date.now()}-${Math.random()}`
        const highlightElementNode = highlightRange(
          range,
          highlightElement,
          highlightStyle
        )
        highlightElementNode.setAttribute('data-highlight-id', highlightId)

        setHighlights(prev =>
          new Map(prev).set(highlightId, {
            element: highlightElementNode,
            selection,
          })
        )

        if (onTextHighlighted) {
          onTextHighlighted(selection)
        }
      })
    },
    [
      containerRef,
      highlights,
      highlightElement,
      highlightStyle,
      onTextHighlighted,
    ]
  )

  /**
   * Remove a specific highlight by its selection data
   * @param selection - The TextSelection to remove
   */
  const removeHighlight = useCallback(
    (selection: TextSelection) => {
      let highlightIdToRemove: string | null = null

      Array.from(highlights.entries()).forEach(([id, highlight]) => {
        if (
          highlight.selection.text === selection.text &&
          highlight.selection.position.x === selection.position.x &&
          highlight.selection.position.y === selection.position.y
        ) {
          highlightIdToRemove = id
        }
      })

      if (!highlightIdToRemove) return

      const highlight = highlights.get(highlightIdToRemove)
      if (!highlight) return

      try {
        removeHighlightFromDOM(highlight.element)

        setHighlights(prev => {
          const newHighlights = new Map(prev)
          newHighlights.delete(highlightIdToRemove!)
          return newHighlights
        })

        if (onHighlightRemoved) {
          onHighlightRemoved(highlight.selection)
        }
      } catch (error) {
        console.error('Error removing highlight:', error)
      }
    },
    [highlights, onHighlightRemoved]
  )

  /**
   * Clear all highlights from the container
   */
  const clearHighlights = useCallback(() => {
    highlights.forEach(highlight => {
      try {
        removeHighlightFromDOM(highlight.element)
        if (onHighlightRemoved) {
          onHighlightRemoved(highlight.selection)
        }
      } catch (error) {
        console.error('Error removing highlight:', error)
      }
    })
    setHighlights(new Map())
  }, [highlights, onHighlightRemoved])

  useEffect(() => {
    const element = containerRef.current
    if (!element || !enabled) return

    element.addEventListener('mouseup', handleTextSelection)

    return () => {
      element.removeEventListener('mouseup', handleTextSelection)
    }
  }, [handleTextSelection, enabled, containerRef])

  return {
    selection: currentSelection,
    highlights: Array.from(highlights.values()).map(h => h.selection),
    highlightText,
    removeHighlight,
    clearHighlights,
    getCurrentTextSelection,
  }
}
