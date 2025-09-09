import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'

import type { TextHighlighterProps, TextSelection } from './types'
import {
  applyReactElementStyles,
  clearSelection,
  findTextInElement,
  getAdjustedSelection,
  highlightRange,
  isRangeAlreadyHighlighted,
  isRangeWithinHighlight,
  isValidSelection,
  removeHighlight,
} from './utils'

/**
 * TextHighlighter Component
 *
 * A React component that enables text selection and highlighting functionality.
 * Users can select text within the component, and it will be automatically
 * highlighted with customizable styling and behavior.
 *
 * @param props - Configuration options for the text highlighter
 * @returns JSX element with highlighting functionality
 *
 * @example
 * ```typescript
 * <TextHighlighter
 *   onTextHighlighted={(selection) => {
 *     console.log('Highlighted:', selection.text)
 *   }}
 *   highlightStyle={{
 *     className: 'custom-highlight',
 *     style: { backgroundColor: '#ffeb3b' }
 *   }}
 * >
 *   <p>Select any text in this paragraph to highlight it.</p>
 * </TextHighlighter>
 * ```
 *
 * @example
 * ```typescript
 * <TextHighlighter
 *   selectionBoundary="cursor"
 *   allowCrossElementSelection={true}
 *   renderSelectionUI={({ selection, modifyHighlight, onClose }) => (
 *     <div className="selection-popup">
 *       <button onClick={() => modifyHighlight(selection, false)}>
 *         Confirm
 *       </button>
 *       <button onClick={() => modifyHighlight(selection, true)}>
 *         Cancel
 *       </button>
 *     </div>
 *   )}
 * >
 *   <div>
 *     <p>Cross-element</p>
 *     <p>selection</p>
 *   </div>
 * </TextHighlighter>
 * ```
 */
export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  children,
  className,
  style,
  enabled = true,
  containerElement = 'div',
  selectionBoundary = 'word',
  highlightStyle,
  highlightElement = 'span',
  allowCrossElementSelection = false,
  clearSelectionAfterHighlight = true,
  removeHighlightOnClick = false,
  onTextSelected,
  onTextHighlighted,
  onHighlightRemoved,
  renderSelectionUI,
  renderHighlight,
  selectedContent = [],
}) => {
  const containerRef = useRef<HTMLElement>(null)
  const [currentSelection, setCurrentSelection] =
    useState<TextSelection | null>(null)
  const [highlights, setHighlights] = useState<
    Map<
      string,
      { element: HTMLElement; selection: TextSelection; temporary?: boolean }
    >
  >(new Map())
  const [customHighlights, setCustomHighlights] = useState<
    Map<
      string,
      { element: HTMLElement; selection: TextSelection; temporary?: boolean }
    >
  >(new Map())
  const [showSelectionUI, setShowSelectionUI] = useState(false)
  const [selectionUIPosition, setSelectionUIPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [tempHighlightId, setTempHighlightId] = useState<string | null>(null)

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isProcessingSelectionRef = useRef(false)

  const stableCallbacks = useMemo(
    () => ({
      onTextSelected,
      onTextHighlighted,
      onHighlightRemoved,
      renderSelectionUI,
      renderHighlight,
    }),
    [
      onTextSelected,
      onTextHighlighted,
      onHighlightRemoved,
      renderSelectionUI,
      renderHighlight,
    ]
  )

  const stableConfig = useMemo(
    () => ({
      selectionBoundary,
      allowCrossElementSelection,
      highlightElement,
      highlightStyle,
      clearSelectionAfterHighlight,
    }),
    [
      selectionBoundary,
      allowCrossElementSelection,
      highlightElement,
      highlightStyle,
      clearSelectionAfterHighlight,
    ]
  )

  /**
   * Add a highlight to the highlights map
   */
  const addHighlight = useCallback(
    (
      highlightId: string,
      highlightData: {
        element: HTMLElement
        selection: TextSelection
        temporary?: boolean
      }
    ) => {
      setHighlights(prev => {
        const newHighlights = new Map(prev)
        newHighlights.set(highlightId, highlightData)
        return newHighlights
      })
    },
    []
  )

  /**
   * Remove a highlight by its ID
   */
  const removeHighlightById = useCallback((highlightId: string) => {
    setHighlights(prev => {
      const newHighlights = new Map(prev)
      newHighlights.delete(highlightId)
      return newHighlights
    })

    setCustomHighlights(prev => {
      const newCustomHighlights = new Map(prev)
      newCustomHighlights.delete(highlightId)
      return newCustomHighlights
    })
  }, [])

  /**
   * Handle text selection events and create highlights
   */
  const handleTextSelection = useCallback(() => {
    if (!enabled || !containerRef.current || isProcessingSelectionRef.current)
      return

    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current)
    }

    isProcessingSelectionRef.current = true
    selectionTimeoutRef.current = setTimeout(() => {
      const selection = getAdjustedSelection(stableConfig.selectionBoundary)

      if (
        !isValidSelection(selection, stableConfig.allowCrossElementSelection)
      ) {
        setCurrentSelection(null)
        setShowSelectionUI(false)
        setTempHighlightId(null)
        setSelectionUIPosition(null)
        isProcessingSelectionRef.current = false
        return
      }

      // Check if the selected range is already highlighted or within a highlight
      if (
        isRangeAlreadyHighlighted(selection!.range, highlights) ||
        isRangeAlreadyHighlighted(selection!.range, customHighlights) ||
        isRangeWithinHighlight(selection!.range, containerRef.current!)
      ) {
        clearSelection()
        setCurrentSelection(null)
        setShowSelectionUI(false)
        setTempHighlightId(null)
        setSelectionUIPosition(null)
        isProcessingSelectionRef.current = false
        return
      }

      setCurrentSelection(selection)

      if (stableCallbacks.onTextSelected) {
        stableCallbacks.onTextSelected(selection!)
      }

      const highlightId = `highlight-${Date.now()}-${Math.random()}`

      try {
        let highlightElementNode: HTMLElement

        if (stableCallbacks.renderHighlight) {
          const customContainer = document.createElement('span')
          customContainer.setAttribute('data-highlight-id', highlightId)
          customContainer.setAttribute('data-custom-highlight', 'true')

          try {
            const fragment = selection!.range.extractContents()
            customContainer.appendChild(fragment)
            selection!.range.insertNode(customContainer)
            highlightElementNode = customContainer
          } catch {
            selection!.range.surroundContents(customContainer)
            highlightElementNode = customContainer
          }

          setCustomHighlights(prev => {
            const newCustomHighlights = new Map(prev)
            newCustomHighlights.set(highlightId, {
              element: highlightElementNode,
              selection: selection!,
              temporary: !!stableCallbacks.renderSelectionUI,
            })
            return newCustomHighlights
          })
        } else {
          highlightElementNode = highlightRange(
            selection!.range,
            stableConfig.highlightElement as string,
            stableConfig.highlightStyle
          )
          highlightElementNode.setAttribute('data-highlight-id', highlightId)

          addHighlight(highlightId, {
            element: highlightElementNode,
            selection: selection!,
            temporary: !!stableCallbacks.renderSelectionUI,
          })
        }

        if (stableCallbacks.renderSelectionUI) {
          document.body.style.overflow = 'hidden'

          const rect = selection!.boundingRect
          const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft
          const scrollY =
            window.pageYOffset || document.documentElement.scrollTop

          setSelectionUIPosition({
            x: rect.left + scrollX,
            y: rect.top + scrollY - 40,
          })

          const handleClickOutside = () => {
            document.body.style.overflow = 'auto'
          }
          document.addEventListener('click', handleClickOutside)

          requestAnimationFrame(() => {
            setShowSelectionUI(true)
            setTempHighlightId(highlightId)
            isProcessingSelectionRef.current = false
          })
        } else {
          if (stableCallbacks.onTextHighlighted) {
            stableCallbacks.onTextHighlighted(selection!)
          }
          isProcessingSelectionRef.current = false
        }

        if (
          stableConfig.clearSelectionAfterHighlight &&
          !stableCallbacks.renderSelectionUI
        ) {
          clearSelection()
        }
      } catch (error) {
        console.error('Error creating highlight:', error)
        isProcessingSelectionRef.current = false
      }
    }, 100)
  }, [
    enabled,
    stableConfig,
    stableCallbacks,
    highlights,
    customHighlights,
    addHighlight,
  ])

  /**
   * Close the selection UI
   */
  const handleCloseSelectionUI = useCallback(() => {
    setShowSelectionUI(false)
    setTempHighlightId(null)
    setSelectionUIPosition(null)
  }, [])

  /**
   * Cancel the current highlight
   */
  const handleCancelHighlight = useCallback(() => {
    if (tempHighlightId) {
      const highlight = highlights.get(tempHighlightId)
      const customHighlight = customHighlights.get(tempHighlightId)

      if (highlight && highlight.temporary) {
        try {
          removeHighlight(highlight.element)
          removeHighlightById(tempHighlightId)
        } catch (error) {
          console.error('Error removing temporary highlight:', error)
        }
      } else if (customHighlight && customHighlight.temporary) {
        try {
          removeHighlight(customHighlight.element)
          removeHighlightById(tempHighlightId)
        } catch (error) {
          console.error('Error removing temporary custom highlight:', error)
        }
      }
    }

    setCurrentSelection(null)
    setShowSelectionUI(false)
    setTempHighlightId(null)
    setSelectionUIPosition(null)
    clearSelection()
  }, [tempHighlightId, highlights, customHighlights, removeHighlightById])

  /**
   * Modify the current highlight
   */
  const handleModifyHighlight = useCallback(
    (highlight: TextSelection, cancelHighlight: boolean) => {
      if (cancelHighlight) {
        handleCancelHighlight()
      } else {
        if (tempHighlightId) {
          const highlightElement = highlights.get(tempHighlightId)?.element
          const customHighlightElement =
            customHighlights.get(tempHighlightId)?.element

          if (highlightElement) {
            highlightElement.textContent = highlight!.text
          } else if (customHighlightElement) {
            customHighlightElement.textContent = highlight!.text
          }
        }
      }
    },
    [tempHighlightId, highlights, customHighlights, handleCancelHighlight]
  )

  /**
   * Remove a specific highlight
   */
  const handleRemoveHighlight = useCallback(
    (highlightId: string) => {
      const highlight = highlights.get(highlightId)
      const customHighlight = customHighlights.get(highlightId)

      if (!highlight && !customHighlight) return

      try {
        if (highlight) {
          removeHighlight(highlight.element)
          if (stableCallbacks.onHighlightRemoved) {
            stableCallbacks.onHighlightRemoved(highlight.selection)
          }
        } else if (customHighlight) {
          removeHighlight(customHighlight.element)
          if (stableCallbacks.onHighlightRemoved) {
            stableCallbacks.onHighlightRemoved(customHighlight.selection)
          }
        }

        removeHighlightById(highlightId)

        // Clear any existing selection to ensure subsequent selections work properly
        clearSelection()
      } catch (error) {
        console.error('Error removing highlight:', error)
      }
    },
    [highlights, customHighlights, stableCallbacks, removeHighlightById]
  )

  useEffect(() => {
    if (!containerRef.current || selectedContent.length === 0) return

    const processedContent = new Set<string>()

    selectedContent.forEach(content => {
      const contentKey = `${content.text}-${content.startOffset}-${content.endOffset}`
      if (processedContent.has(contentKey)) return

      processedContent.add(contentKey)

      const ranges = findTextInElement(containerRef.current!, content.text)
      ranges.forEach(range => {
        if (
          isRangeAlreadyHighlighted(range, highlights) ||
          isRangeAlreadyHighlighted(range, customHighlights) ||
          isRangeWithinHighlight(range, containerRef.current!)
        ) {
          return
        }

        const selection: TextSelection = {
          text: content.text,
          range: range.cloneRange(),
          position: {
            x: range.getBoundingClientRect().left + window.scrollX,
            y: range.getBoundingClientRect().top + window.scrollY,
          },
          boundingRect: range.getBoundingClientRect(),
        }

        const highlightElementNode = highlightRange(
          range,
          stableConfig.highlightElement as string,
          stableConfig.highlightStyle
        )
        const highlightId = `preselected-${Date.now()}-${Math.random()}`
        highlightElementNode.setAttribute('data-highlight-id', highlightId)

        addHighlight(highlightId, {
          element: highlightElementNode,
          selection,
        })
      })
    })
  }, [
    selectedContent,
    stableConfig.highlightElement,
    stableConfig.highlightStyle,
    addHighlight,
    customHighlights,
    highlights,
  ])

  useEffect(() => {
    if (!showSelectionUI || !stableCallbacks.renderSelectionUI) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (containerRef.current && containerRef.current.contains(target)) {
        return
      }

      const selectionUIElement = target as HTMLElement
      if (selectionUIElement.closest('[data-selection-ui]')) {
        return
      }

      const highlightedElement = target as HTMLElement
      if (highlightedElement.hasAttribute('data-highlight-id')) {
        return
      }

      requestAnimationFrame(() => {
        handleCancelHighlight()
      })
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [
    showSelectionUI,
    stableCallbacks.renderSelectionUI,
    handleCancelHighlight,
  ])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const handleHighlightClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const highlightId = target.getAttribute('data-highlight-id')

      if (
        highlightId &&
        (highlights.has(highlightId) || customHighlights.has(highlightId))
      ) {
        if (removeHighlightOnClick) {
          event.preventDefault()
          event.stopPropagation()
          handleRemoveHighlight(highlightId)
        }
      }
    }

    element.addEventListener('click', handleHighlightClick)
    return () => {
      element.removeEventListener('click', handleHighlightClick)
    }
  }, [
    highlights,
    customHighlights,
    removeHighlightOnClick,
    handleRemoveHighlight,
  ])

  useEffect(() => {
    if (customHighlights.size === 0) return

    const handleScroll = () => {
      setCustomHighlights(prev => new Map(prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [customHighlights.size])

  useEffect(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
    }
  }, [])

  const containerStyle = useMemo(
    () => ({
      userSelect: enabled ? 'text' : 'none',
      ...style,
    }),
    [enabled, style]
  )

  useEffect(() => {
    if (!stableCallbacks.renderHighlight) return

    customHighlights.forEach(highlightData => {
      const { element, selection } = highlightData

      if (!document.body.contains(element)) return

      const customElement = stableCallbacks.renderHighlight!({
        children: selection.text,
        selection,
        className: 'custom-highlight',
        style: {},
      })

      if (React.isValidElement(customElement)) {
        applyReactElementStyles(customElement, element)
      }
    })
  }, [customHighlights, stableCallbacks.renderHighlight])

  return (
    <>
      {React.createElement(
        containerElement as string,
        {
          ref: containerRef,
          className,
          style: containerStyle,
          onMouseUp: enabled ? handleTextSelection : undefined,
        },
        children
      )}

      {showSelectionUI &&
        currentSelection &&
        stableCallbacks.renderSelectionUI &&
        selectionUIPosition &&
        createPortal(
          <div
            data-selection-ui
            style={{
              position: 'absolute',
              left: selectionUIPosition.x || 0,
              top: selectionUIPosition.y || 0,
              zIndex: 1000,
            }}
          >
            {stableCallbacks.renderSelectionUI({
              selection: currentSelection,
              modifyHighlight: (highlight: TextSelection, cancel: boolean) =>
                handleModifyHighlight(highlight, cancel),
              onClose: handleCloseSelectionUI,
            })}
          </div>,
          document.body
        )}
    </>
  )
}

export default TextHighlighter
