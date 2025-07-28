import { CSSProperties, JSX, ReactNode } from 'react'

/**
 * Defines how text selection boundaries should be handled
 * - 'cursor': Highlights exactly what the user selected
 * - 'word': Extends selection to complete word boundaries
 */
export type SelectionBoundary = 'cursor' | 'word'

/**
 * Represents a text selection with position and bounding information
 */
export interface TextSelection {
  /** The selected text content */
  text: string
  /** The DOM range object representing the selection */
  range: Range
  /** Absolute position coordinates of the selection */
  position: {
    x: number
    y: number
  }
  /** Bounding rectangle of the selection */
  boundingRect: DOMRect
}

/**
 * Styling configuration for highlighted text
 */
export interface HighlightStyle {
  /** CSS class name to apply to highlight elements */
  className?: string
  /** Inline CSS styles to apply to highlight elements */
  style?: CSSProperties
}

/**
 * Configuration options for text highlighting behavior
 */
export interface HighlightConfig {
  /**
   * Whether to stop highlighting at cursor position or extend to word boundaries
   * @default 'word'
   */
  selectionBoundary?: SelectionBoundary

  /**
   * Custom styling for the highlight
   */
  highlightStyle?: HighlightStyle

  /**
   * Element type to render the highlight as
   * @default 'span'
   */
  highlightElement?: keyof JSX.IntrinsicElements

  /**
   * Whether to allow multi-element selections
   * @default false
   */
  allowCrossElementSelection?: boolean

  /**
   * Whether to clear selection after highlighting
   * @default true
   */
  clearSelectionAfterHighlight?: boolean

  /**
   * Whether to remove highlight when clicked
   * @default false
   */
  removeHighlightOnClick?: boolean
}

/**
 * Event handlers for highlighting actions
 */
export interface HighlightActions {
  /**
   * Called when text is selected and highlighted
   */
  onTextHighlighted?: (selection: TextSelection) => void

  /**
   * Called when a highlight is removed
   */
  onHighlightRemoved?: (selection: TextSelection) => void

  /**
   * Called when text is selected but before highlighting
   */
  onTextSelected?: (selection: TextSelection) => void
}

/**
 * Render props for customizing highlight and selection UI
 */
export interface HighlightRenderProps {
  /**
   * Render prop for custom highlight element
   */
  renderHighlight?: (props: {
    children: ReactNode
    selection: TextSelection
    className?: string
    style?: CSSProperties
  }) => ReactNode

  /**
   * Render prop for custom selection UI (tooltip, buttons, etc.)
   */
  renderSelectionUI?: (props: {
    selection: TextSelection
    modifyHighlight?: (highlight: TextSelection, cancel: boolean) => void
    onClose?: () => void
  }) => ReactNode
}

/**
 * Props for the TextHighlighter component
 */
export interface TextHighlighterProps
  extends HighlightConfig,
    HighlightActions,
    HighlightRenderProps {
  /**
   * Content to make highlightable
   */
  children: ReactNode

  /**
   * Element type to render the container as
   * @default 'div'
   */
  containerElement?: keyof JSX.IntrinsicElements

  /**
   * Additional className for the container
   */
  className?: string

  /**
   * Additional styles for the container
   */
  style?: CSSProperties

  /**
   * Whether highlighting is enabled
   * @default true
   */
  enabled?: boolean

  /**
   * Pre-selected content to highlight on mount
   */
  selectedContent?: Array<{
    text: string
    startOffset: number
    endOffset: number
    elementSelector?: string
  }>
}

/**
 * Props for the useTextHighlighter hook
 */
export interface UseTextHighlighterProps
  extends HighlightConfig,
    HighlightActions {
  /**
   * Ref to the container element
   */
  containerRef: React.RefObject<HTMLElement>

  /**
   * Whether highlighting is enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Return value from the useTextHighlighter hook
 */
export interface UseTextHighlighterReturn {
  /**
   * Current selection state
   */
  selection: TextSelection | null

  /**
   * All active highlights
   */
  highlights: TextSelection[]

  /**
   * Manually highlight text
   */
  highlightText: (text: string, elementSelector?: string) => void

  /**
   * Remove a specific highlight
   */
  removeHighlight: (selection: TextSelection) => void

  /**
   * Clear all highlights
   */
  clearHighlights: () => void

  /**
   * Get current text selection without highlighting
   */
  getCurrentTextSelection: () => TextSelection | null
}
