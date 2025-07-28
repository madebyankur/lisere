/**
 * Main TextHighlighter component for selecting and highlighting text
 */
export { default as TextHighlighter } from './text-highlighter'

/**
 * Hook for programmatic text highlighting control
 */
export { useTextHighlighter } from './use-text-highlighter'

/**
 * TypeScript types for the text highlighting functionality
 */
export type {
  TextSelection,
  SelectionBoundary,
  HighlightStyle,
  HighlightConfig,
  HighlightActions,
  HighlightRenderProps,
  TextHighlighterProps,
  UseTextHighlighterProps,
  UseTextHighlighterReturn,
} from './types'

/**
 * Utility functions for text highlighting operations
 */
export {
  getCurrentTextSelection,
  adjustRangeToWordBoundaries,
  getAdjustedSelection,
  isSelectionCrossElement,
  createHighlightElement,
  highlightRange,
  removeHighlight,
  findTextInElement,
  clearSelection,
  isValidSelection,
  checkRangeIntersection,
  isRangeAlreadyHighlighted,
  isRangeWithinHighlight,
  applyReactElementStyles,
} from './utils'
