'use client';

import React, { useRef, useState } from 'react';
import {
  highlightRange,
  removeHighlight,
  findTextInElement,
  clearSelection,
  isValidSelection,
} from 'lisere';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Preview } from '@/components/ui/preview';
import { HeaderLink } from '@/components/ui/header-link';
import { Separator } from '@/components/ui/separator';

export function UtilityFunctionsExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightCount, setHighlightCount] = useState(0);
  const [currentSelection, setCurrentSelection] = useState<string>('');

  const handleSearchHighlight = () => {
    if (searchTerm.trim() && containerRef.current) {
      const ranges = findTextInElement(
        containerRef.current as HTMLElement,
        searchTerm.trim(),
      );
      ranges.forEach(range => {
        highlightRange(range, 'span', {
          className:
            'bg-yellow-50 outline outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]',
        });
      });
      setHighlightCount(prev => prev + ranges.length);
      setSearchTerm('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchHighlight();
  };

  const handleManualHighlight = () => {
    if (!containerRef.current || !searchTerm.trim()) return;

    const ranges = findTextInElement(containerRef.current, searchTerm.trim());
    let count = 0;

    ranges.forEach(range => {
      try {
        const highlight = highlightRange(range, 'span', {
          className:
            'bg-yellow-50 outline outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]',
        });
        highlight.setAttribute('data-manual-highlight', 'true');
        count++;
      } catch (error) {
        console.error('Failed to highlight range:', error);
      }
    });

    setHighlightCount(prev => prev + count);
    setSearchTerm('');
  };

  const handleGetSelection = () => {
    try {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString().trim();

        if (text) {
          setCurrentSelection(text);
        } else {
          setCurrentSelection('No text selected');
        }
      } else {
        if (selection?.isCollapsed) {
          setCurrentSelection('No text selected (click and drag to select)');
        } else {
          setCurrentSelection('No selection');
        }
      }
    } catch (error) {
      console.error('Error getting selection:', error);
      setCurrentSelection('Error getting selection');
    }
  };

  const handleClearManualHighlights = () => {
    if (!containerRef.current) return;

    const manualHighlights = containerRef.current.querySelectorAll(
      '[data-manual-highlight]',
    );
    manualHighlights.forEach(highlight => {
      try {
        removeHighlight(highlight as HTMLElement);
      } catch (error) {
        console.error('Failed to remove highlight:', error);
      }
    });

    setHighlightCount(0);
  };

  const handleClearSelection = () => {
    clearSelection();
    setCurrentSelection('');

    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  React.useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString().trim();
        if (text && text.length > 0) {
          console.log('Mouse up - Selection detected:', text);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleValidateSelection = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString().trim();

        if (text) {
          const mockSelection = {
            text,
            range,
            position: { x: 0, y: 0 },
            boundingRect: range.getBoundingClientRect(),
          };

          const isValid = isValidSelection(mockSelection, false);
          const isInContainer = containerRef.current?.contains(
            range.commonAncestorContainer,
          );

          if (isValid && isInContainer) {
            alert(`Selection "${text}" is valid for highlighting`);
          } else if (!isInContainer) {
            alert(`Selection "${text}" is outside the highlightable area`);
          } else {
            alert(`Selection "${text}" is not valid for highlighting`);
          }
        } else {
          alert('No text selected');
        }
      } else {
        if (selection?.isCollapsed) {
          alert('No text selected - click and drag to select text first');
        } else {
          alert('No current selection');
        }
      }
    } catch (error) {
      console.error('Error validating selection:', error);
      alert('Error validating selection');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="utility-functions-link"
          aria-labelledby="utility-functions-link"
          aria-label="Utility Functions"
          href="#utility-functions"
        >
          Utility Functions
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Use the exported utility functions for direct DOM manipulation and
          advanced highlighting scenarios.
        </p>
      </div>

      <div className="mb-4 space-y-4">
        <form
          id="hook-form"
          name="hook-form"
          aria-labelledby="hook-form"
          aria-label="Hook Form"
          onSubmit={handleSubmit}
          className="mx-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-1">
              <Label
                htmlFor="utility-input"
                className="text-secondary hidden text-sm font-semibold"
              >
                Search Text
              </Label>
              <Input
                id="utility-input"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Type text to select"
                onKeyDown={e => e.key === 'Enter' && handleManualHighlight()}
              />
            </div>

            <Button
              onClick={handleManualHighlight}
              className="w-full sm:w-auto"
            >
              Highlight
            </Button>
          </div>
        </form>
      </div>

      <Preview
        code={`import {
  highlightRange,
  removeHighlight,
  findTextInElement,
  clearSelection,
  isValidSelection
} from 'lisere'

// Manual highlighting
const container = document.getElementById('content')
const ranges = findTextInElement(container, 'search term')
ranges.forEach(range => {
  const highlight = highlightRange(range, 'span', {
    className: 'manual-highlight',
    style: { backgroundColor: 'yellow' }
  })
})

// Get current selection
const selection = window.getSelection()
if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
  const range = selection.getRangeAt(0)
  const text = range.toString().trim()
  if (text) {
    console.log('Selected text:', text)
  }
}

// Remove highlight
const highlightElement = document.querySelector('.highlight')
if (highlightElement) {
  removeHighlight(highlightElement)
}

// Clear selection
clearSelection()
window.getSelection()?.removeAllRanges()

// Validate selection
const selection = window.getSelection()
if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
  const range = selection.getRangeAt(0)
  const text = range.toString().trim()
  const isInContainer = container.contains(range.commonAncestorContainer)
  console.log('Selection valid:', isInContainer && text.length > 0)
}`}
        preview={
          <div className="space-y-4">
            <div ref={containerRef} style={{ userSelect: 'text' }}>
              <p className="text-accent text-pretty font-medium leading-relaxed">
                This example demonstrates direct utility function usage. You can
                manually highlight specific text using the search input above,
                or select text with your mouse to test the selection utilities.
                The utility functions provide low-level control over
                highlighting behavior for advanced use cases.
              </p>
            </div>

            <Separator className="mb-8 mt-4" />

            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetSelection}
                  className="h-8 rounded-xl px-2"
                >
                  Get Selection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleValidateSelection}
                  className="h-8 rounded-xl px-2"
                >
                  Validate Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-8 rounded-xl px-2"
                >
                  Clear Selection
                </Button>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearManualHighlights}
                className="group h-8 rounded-xl px-2"
              >
                Clear Highlights{' '}
                <span className="group-hover:bg-destructive-foreground/25 bg-destructive flex h-4 w-4 items-center justify-center rounded-sm font-mono text-xs tabular-nums">
                  {highlightCount}
                </span>
              </Button>
            </div>
          </div>
        }
      />

      <div className="flex flex-col gap-2 text-sm">
        <span className="text-accent font-semibold">Current Selection:</span>
        {currentSelection.length === 0 && (
          <div className="bg-card border-border text-accent flex w-fit items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-medium">
            No text selected
          </div>
        )}
        {currentSelection && currentSelection.length > 0 && (
          <div className="bg-card border-border text-accent flex w-fit items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-medium">
            {currentSelection}
          </div>
        )}
      </div>
    </div>
  );
}
