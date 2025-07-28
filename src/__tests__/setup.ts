/// <reference types="jest" />

import '@testing-library/jest-dom'

Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window, 'scrollX', {
  writable: true,
  value: 0,
})

Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}))

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
})

const originalCreateRange = document.createRange
document.createRange = () => {
  const range = originalCreateRange.call(document)

  range.getBoundingClientRect = jest.fn().mockReturnValue({
    left: 0,
    top: 0,
    right: 100,
    bottom: 20,
    width: 100,
    height: 20,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  })

  const originalCloneRange = range.cloneRange
  range.cloneRange = () => {
    const clonedRange = originalCloneRange.call(range)
    clonedRange.getBoundingClientRect = range.getBoundingClientRect
    clonedRange.toString = range.toString
    return clonedRange
  }

  const originalToString = range.toString
  range.toString = jest.fn().mockImplementation(() => {
    try {
      return originalToString.call(range) || 'test text'
    } catch {
      return 'test text'
    }
  })

  range.setStart = jest.fn()
  range.setEnd = jest.fn()

  return range
}

export const createMockSelection = (text: string, range: Range) => {
  const mockSelection = {
    rangeCount: 1,
    isCollapsed: false,
    getRangeAt: jest.fn().mockReturnValue(range),
    toString: jest.fn().mockReturnValue(text),
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
  }
  ;(window.getSelection as jest.Mock).mockReturnValue(mockSelection)
  return mockSelection
}

export const createMockRange = (
  text: string,
  startContainer: Node,
  endContainer: Node,
  startOffset: number,
  endOffset: number
) => {
  const range = document.createRange()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  range.toString = jest.fn().mockReturnValue(text)
  return range
}

export const createMockTextNode = (text: string) => {
  return {
    nodeType: Node.TEXT_NODE,
    textContent: text,
    parentNode: null,
  } as unknown as Text
}
