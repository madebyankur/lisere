'use client';

import React, { useState } from 'react';
import { TextHighlighter, type TextSelection } from 'lisere';

import { Preview } from '@/components/ui/preview';
import { HeaderLink } from '@/components/ui/header-link';

export function SelectionUIExample() {
  const [highlights, setHighlights] = useState<string[]>([]);

  const handleConfirmHighlight = (
    selection: TextSelection,
    modifyHighlight: (highlight: TextSelection, cancel: boolean) => void,
    onClose: () => void,
  ) => {
    setHighlights(prev => [...prev, selection.text]);
    modifyHighlight?.(selection, false);
    onClose();
  };

  const handleCancelHighlight = (
    selection: TextSelection,
    modifyHighlight: (highlight: TextSelection, cancel: boolean) => void,
    onClose: () => void,
  ) => {
    setHighlights(prev => prev.filter(text => text !== selection.text));
    modifyHighlight?.(selection, true);
    onClose();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="custom-selection-ui-link"
          aria-labelledby="custom-selection-ui-link"
          aria-label="Custom Selection UI"
          href="#custom-selection-ui"
        >
          Custom Selection UI
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Add custom UI that appears when text is selected, allowing users to
          confirm or cancel highlighting. Note that the text is highlighted
          immediately when selected, and the UI allows you to confirm or cancel
          the highlight.
        </p>
      </div>

      <Preview
        code={`<TextHighlighter
  renderSelectionUI={({
  selection,
  modifyHighlight,
  onClose,
}: {
  selection: TextSelection;
  modifyHighlight: (highlight: TextSelection, cancel: boolean) => void;
  onClose: () => void;
}) => (
    <div className="selection-popup">
      <span>Highlight "{selection.text}"?</span>
      <button onClick={() => modifyHighlight?.(selection, false)}>
        Yes
      </button>
      <button onClick={() => modifyHighlight?.(selection, true)}>
        No
      </button>
      <button onClick={onClose}>
        Cancel
      </button>
    </div>
  )}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            renderSelectionUI={({
              selection,
              modifyHighlight,
              onClose,
            }: {
              selection: TextSelection;
              modifyHighlight?: (
                highlight: TextSelection,
                cancel: boolean,
              ) => void;
              onClose?: () => void;
            }) => (
              <div className="bg-popover shadow-contrast/5 text-primary flex -translate-y-2 items-center gap-1 rounded-2xl py-2 pl-3 pr-2 shadow-[0_0_0_1px,0_0_2px_-1px,0_2px_4px_-2px,0_4px_8px_-4px]">
                <span className="mr-2 text-sm">
                  Add to chat "
                  {selection.text.length > 20
                    ? selection.text.slice(0, 20) + '...'
                    : selection.text}
                  "?
                </span>
                <button
                  id="confirm-highlight-button"
                  aria-label="Confirm highlight"
                  onClick={() =>
                    handleConfirmHighlight(
                      selection,
                      modifyHighlight!,
                      onClose!,
                    )
                  }
                  className="bg-accent/10 text-primary hover:bg-accent/15 select-none rounded-lg px-2.5 py-0.5 text-sm"
                >
                  Yes
                </button>
                <button
                  id="cancel-highlight-button"
                  aria-label="Cancel highlight"
                  onClick={() =>
                    handleCancelHighlight(selection, modifyHighlight!, onClose!)
                  }
                  className="bg-accent/10 text-primary hover:bg-accent/15 select-none rounded-lg px-2.5 py-0.5 text-sm"
                >
                  No
                </button>
              </div>
            )}
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              Select any text in this paragraph to see the custom selection UI
              in action. The text will be highlighted immediately, and a popup
              will appear asking if you want to keep the highlight. Click "Yes"
              to confirm or "No" to remove it. This is useful for applications
              where you want to show immediate feedback while still allowing
              user confirmation.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
}
