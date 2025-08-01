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
  throttle,
  wouldDragCrossLines,
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
  showDraggableHandles = false,
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
  const [draggedHighlightId, setDraggedHighlightId] = useState<string | null>(
    null
  )

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isProcessingSelectionRef = useRef(false)
  const dragRef = useRef<{
    highlightId: string
    handle: 'left' | 'right'
  } | null>(null)
  const dragHandlersRef = useRef<{
    handleDragStart: (
      highlightId: string,
      handle: 'left' | 'right',
      event: MouseEvent
    ) => void
    handleDragMove: (event: MouseEvent) => void
    handleDragEnd: () => void
  } | null>(null)

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

          if (showDraggableHandles) {
            addDraggableHandles(highlightElementNode, highlightId)
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

          if (showDraggableHandles) {
            addDraggableHandles(highlightElementNode, highlightId)
          }

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
    showDraggableHandles,
  ])

  /**
   * Close the selection UI
   */
  const handleCloseSelectionUI = useCallback(() => {
    setShowSelectionUI(false)
    setTempHighlightId(null)
    setSelectionUIPosition(null)
  }, [])

  // Cache for handle references to avoid DOM queries
  const handleRefs = useRef(
    new WeakMap<HTMLElement, { left: HTMLElement; right: HTMLElement }>()
  )

  /**
   * Remove draggable handles from a highlight element
   */
  const removeDraggableHandles = useCallback((element: HTMLElement) => {
    const handles = handleRefs.current.get(element)
    if (handles) {
      handles.left.remove()
      handles.right.remove()
      handleRefs.current.delete(element)
    }
  }, [])

  /**
   * Remove highlight and its handles
   */
  const removeHighlightWithHandles = useCallback(
    (element: HTMLElement) => {
      removeDraggableHandles(element)
      removeHighlight(element)
    },
    [removeDraggableHandles]
  )

  /**
   * Cancel the current highlight
   */
  const handleCancelHighlight = useCallback(() => {
    if (tempHighlightId) {
      const highlight = highlights.get(tempHighlightId)
      const customHighlight = customHighlights.get(tempHighlightId)

      if (highlight && highlight.temporary) {
        try {
          removeHighlightWithHandles(highlight.element)
          removeHighlightById(tempHighlightId)
        } catch (error) {
          console.error('Error removing temporary highlight:', error)
        }
      } else if (customHighlight && customHighlight.temporary) {
        try {
          removeHighlightWithHandles(customHighlight.element)
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
  }, [
    tempHighlightId,
    highlights,
    customHighlights,
    removeHighlightById,
    removeHighlightWithHandles,
  ])

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
          removeHighlightWithHandles(highlight.element)
          if (stableCallbacks.onHighlightRemoved) {
            stableCallbacks.onHighlightRemoved(highlight.selection)
          }
        } else if (customHighlight) {
          removeHighlightWithHandles(customHighlight.element)
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
    [
      highlights,
      customHighlights,
      stableCallbacks,
      removeHighlightById,
      removeHighlightWithHandles,
    ]
  )

  /**
   * Add draggable handles to a highlight element
   */
  const addDraggableHandles = useCallback(
    (element: HTMLElement, highlightId: string) => {
      if (!showDraggableHandles) return

      removeDraggableHandles(element)

      element.style.position = 'relative'
      element.style.display = 'inline'

      const leftHandle = document.createElement('div')
      leftHandle.className = 'highlight-handle highlight-handle-left'
      leftHandle.style.cssText = `
      position: absolute;
      left: -6px;
      top: 2px;
      width: 4px;
      height: 16px;
      background: #0c0a09;
      border-radius: 3px;
      cursor: w-resize;
      z-index: 1000;
      opacity: 0;
      box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease-in-out;
    `
      leftHandle.setAttribute('data-handle', 'left')
      leftHandle.setAttribute('data-highlight-id', highlightId)

      const rightHandle = document.createElement('div')
      rightHandle.className = 'highlight-handle highlight-handle-right'
      rightHandle.style.cssText = `
      position: absolute;
      right: -6px;
      bottom: 1px;
      width: 4px;
      height: 16px;
      background: #0c0a09;
      border-radius: 3px;
      cursor: e-resize;
      z-index: 1000;
      opacity: 0;
      box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease-in-out;
    `
      rightHandle.setAttribute('data-handle', 'right')
      rightHandle.setAttribute('data-highlight-id', highlightId)

      leftHandle.addEventListener('mousedown', (e: MouseEvent) => {
        dragHandlersRef.current?.handleDragStart(highlightId, 'left', e)
      })
      rightHandle.addEventListener('mousedown', (e: MouseEvent) => {
        dragHandlersRef.current?.handleDragStart(highlightId, 'right', e)
      })

      const updateHandleVisibility = throttle((e: Event) => {
        const mouseEvent = e as unknown as MouseEvent
        const rect = element.getBoundingClientRect()
        const relativeX = mouseEvent.clientX - rect.left
        const relativeY = mouseEvent.clientY - rect.top
        const width = rect.width
        const height = rect.height
        const edgeThreshold = 20

        const nearLeftEdge = relativeX <= edgeThreshold
        const nearTopEdge = relativeY <= edgeThreshold
        const nearBottomEdge = relativeY >= height - edgeThreshold
        const showLeftHandle = nearLeftEdge || nearTopEdge || nearBottomEdge

        const nearRightEdge = relativeX >= width - edgeThreshold
        const showRightHandle = nearRightEdge || nearTopEdge || nearBottomEdge

        // Keep the active handle visible during drag
        const isDraggingThisHighlight = draggedHighlightId === highlightId
        const isDraggingLeft =
          isDraggingThisHighlight && dragRef.current?.handle === 'left'
        const isDraggingRight =
          isDraggingThisHighlight && dragRef.current?.handle === 'right'

        leftHandle.style.opacity = showLeftHandle || isDraggingLeft ? '1' : '0'
        rightHandle.style.opacity =
          showRightHandle || isDraggingRight ? '1' : '0'
      }, 16) // ~60fps

      element.addEventListener('mousemove', updateHandleVisibility)

      element.addEventListener('mouseleave', () => {
        if (!draggedHighlightId || draggedHighlightId !== highlightId) {
          leftHandle.style.opacity = '0'
          rightHandle.style.opacity = '0'
        }
      })

      element.appendChild(leftHandle)
      element.appendChild(rightHandle)

      // Store handle references for efficient cleanup
      handleRefs.current.set(element, { left: leftHandle, right: rightHandle })
    },
    [showDraggableHandles, draggedHighlightId, removeDraggableHandles]
  )

  /**
   * Handle drag movement
   */
  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) {
        return
      }

      const { highlightId, handle } = dragRef.current

      const highlightFromMain = highlights.get(highlightId)
      const highlightFromCustom = customHighlights.get(highlightId)
      const highlight = highlightFromMain || highlightFromCustom

      if (!highlight) {
        return
      }

      try {
        const highlightElement = highlight.element
        const parent = highlightElement.parentNode
        if (!parent) return

        const originalRange = highlight.selection.range.cloneRange()

        removeDraggableHandles(highlightElement)

        while (highlightElement.firstChild) {
          parent.insertBefore(highlightElement.firstChild, highlightElement)
        }
        parent.removeChild(highlightElement)

        parent.normalize()

        let targetPosition: { node: Node; offset: number } | null = null

        if (document.caretPositionFromPoint) {
          const caret = document.caretPositionFromPoint(
            event.clientX,
            event.clientY
          )
          if (caret) {
            targetPosition = { node: caret.offsetNode, offset: caret.offset }
          }
        } else if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(
            event.clientX,
            event.clientY
          )
          if (range) {
            targetPosition = {
              node: range.startContainer,
              offset: range.startOffset,
            }
          }
        }

        if (!targetPosition) {
          const newRange = document.createRange()
          newRange.setStart(
            originalRange.startContainer,
            originalRange.startOffset
          )
          newRange.setEnd(originalRange.endContainer, originalRange.endOffset)
          const restoredElement = highlightRange(
            newRange,
            stableConfig.highlightElement as string,
            stableConfig.highlightStyle
          )
          restoredElement.setAttribute('data-highlight-id', highlightId)

          highlight.element = restoredElement
          highlight.selection.range = originalRange
          highlight.selection.boundingRect =
            originalRange.getBoundingClientRect()

          if (showDraggableHandles) {
            addDraggableHandles(restoredElement, highlightId)
          }

          parent.normalize()
          return
        }

        // Create range preventing handles from crossing over
        const newRange = document.createRange()

        if (handle === 'left') {
          // Left handle dragged - ensure it doesn't go past the right handle
          const originalEnd = {
            node: originalRange.endContainer,
            offset: originalRange.endOffset,
          }

          // Compare positions using Range.compareBoundaryPoints
          const targetRange = document.createRange()
          targetRange.setStart(targetPosition.node, targetPosition.offset)
          targetRange.collapse(true)

          const endRange = document.createRange()
          endRange.setStart(originalEnd.node, originalEnd.offset)
          endRange.collapse(true)

          if (
            targetRange.compareBoundaryPoints(Range.START_TO_START, endRange) >
            0
          ) {
            const restoredElement = highlightRange(
              originalRange,
              stableConfig.highlightElement as string,
              stableConfig.highlightStyle
            )
            restoredElement.setAttribute('data-highlight-id', highlightId)

            highlight.element = restoredElement
            highlight.selection.range = originalRange
            highlight.selection.boundingRect =
              originalRange.getBoundingClientRect()

            if (showDraggableHandles) {
              addDraggableHandles(restoredElement, highlightId)
            }

            parent.normalize()
            return
          }

          newRange.setStart(targetPosition.node, targetPosition.offset)
          newRange.setEnd(originalEnd.node, originalEnd.offset)
        } else {
          const originalStart = {
            node: originalRange.startContainer,
            offset: originalRange.startOffset,
          }

          const targetRange = document.createRange()
          targetRange.setStart(targetPosition.node, targetPosition.offset)
          targetRange.collapse(true)

          const startRange = document.createRange()
          startRange.setStart(originalStart.node, originalStart.offset)
          startRange.collapse(true)

          if (
            targetRange.compareBoundaryPoints(
              Range.START_TO_START,
              startRange
            ) < 0
          ) {
            const restoredElement = highlightRange(
              originalRange,
              stableConfig.highlightElement as string,
              stableConfig.highlightStyle
            )
            restoredElement.setAttribute('data-highlight-id', highlightId)

            highlight.element = restoredElement
            highlight.selection.range = originalRange
            highlight.selection.boundingRect =
              originalRange.getBoundingClientRect()

            if (showDraggableHandles) {
              addDraggableHandles(restoredElement, highlightId)
            }

            parent.normalize()
            return
          }

          newRange.setStart(originalStart.node, originalStart.offset)
          newRange.setEnd(targetPosition.node, targetPosition.offset)
        }

        const range = newRange

        if (wouldDragCrossLines(originalRange, range)) {
          const restoredElement = highlightRange(
            originalRange,
            stableConfig.highlightElement as string,
            stableConfig.highlightStyle
          )
          restoredElement.setAttribute('data-highlight-id', highlightId)

          highlight.element = restoredElement
          highlight.selection.range = originalRange
          highlight.selection.boundingRect =
            originalRange.getBoundingClientRect()

          if (showDraggableHandles) {
            addDraggableHandles(restoredElement, highlightId)
          }

          parent.normalize()
          return
        }

        const newText = range.toString().trim()

        if (range.collapsed) {
          const restoredElement = highlightRange(
            originalRange,
            stableConfig.highlightElement as string,
            stableConfig.highlightStyle
          )
          restoredElement.setAttribute('data-highlight-id', highlightId)

          highlight.element = restoredElement
          highlight.selection.range = originalRange
          highlight.selection.boundingRect =
            originalRange.getBoundingClientRect()

          if (showDraggableHandles) {
            addDraggableHandles(restoredElement, highlightId)
          }

          parent.normalize()
          return
        }

        const newHighlightElement = highlightRange(
          range,
          stableConfig.highlightElement as string,
          stableConfig.highlightStyle
        )
        newHighlightElement.setAttribute('data-highlight-id', highlightId)

        highlight.element = newHighlightElement
        highlight.selection.text = newText
        highlight.selection.range = range
        highlight.selection.boundingRect = range.getBoundingClientRect()

        addDraggableHandles(newHighlightElement, highlightId)
      } catch (error) {
        console.error('Error updating highlight range:', error)
      }
    },
    [
      highlights,
      customHighlights,
      showDraggableHandles,
      stableConfig,
      addDraggableHandles,
      removeDraggableHandles,
    ]
  )

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback(() => {
    setDraggedHighlightId(null)
    dragRef.current = null

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }, [handleDragMove])

  /**
   * Handle drag start on highlight handles
   */
  const handleDragStart = useCallback(
    (highlightId: string, handle: 'left' | 'right', event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      setDraggedHighlightId(highlightId)
      dragRef.current = { highlightId, handle }

      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
    },
    [handleDragEnd, handleDragMove]
  )

  useEffect(() => {
    dragHandlersRef.current = {
      handleDragStart,
      handleDragMove,
      handleDragEnd,
    }
  }, [handleDragStart, handleDragMove, handleDragEnd])

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

        if (showDraggableHandles) {
          addDraggableHandles(highlightElementNode, highlightId)
        }

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
    showDraggableHandles,
    draggedHighlightId,
    addDraggableHandles,
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

    const handleHighlightClick = (event: MouseEvent | Event) => {
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

    element.addEventListener('click', handleHighlightClick as EventListener)
    return () => {
      element.removeEventListener(
        'click',
        handleHighlightClick as EventListener
      )
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
