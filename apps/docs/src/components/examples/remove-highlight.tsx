'use client';

import React, { useState } from 'react';
import { TextHighlighter, type TextSelection } from 'lisere';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Preview } from '@/components/ui/preview';
import { HeaderLink } from '@/components/ui/header-link';

export function RemoveHighlightExample() {
  const [highlights, setHighlights] = useState<string[]>([]);
  const [removeOnClick, setRemoveOnClick] = useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-2 space-y-2">
        <HeaderLink
          id="remove-highlight-on-click-link"
          aria-labelledby="remove-highlight-on-click-link"
          aria-label="Remove Highlight on Click"
          href="#remove-highlight-on-click"
        >
          Remove Highlight on Click
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Enable the toggle below to remove highlights when you click on them.
        </p>
      </div>

      <div className="mb-4 ml-4 mr-6 flex items-center">
        <Label
          id="remove-highlight-label"
          aria-labelledby="remove-highlight-label"
          htmlFor="remove-highlight"
          className="hover:bg-accent/10 flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition-colors duration-150 ease-out"
        >
          <Checkbox
            id="remove-highlight"
            aria-labelledby="remove-highlight"
            checked={removeOnClick}
            onCheckedChange={() => setRemoveOnClick(!removeOnClick)}
          />
          Remove highlight on click
        </Label>
      </div>

      <Preview
        code={`<TextHighlighter
  removeHighlightOnClick={true}
  onTextHighlighted={(selection: TextSelection) => {
    console.log('Highlighted:', selection.text)
  }}
  onHighlightRemoved={(selection: TextSelection) => {
    console.log('Removed:', selection.text)
  }}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            removeHighlightOnClick={removeOnClick}
            onTextHighlighted={(selection: TextSelection) => {
              setHighlights(prev => [...prev, selection.text]);
            }}
            onHighlightRemoved={(selection: TextSelection) => {
              setHighlights(prev =>
                prev.filter(text => text !== selection.text),
              );
            }}
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This demo shows how to remove highlights by clicking on them.
              First, select some text to highlight it. Then, if the toggle is
              enabled, click on any highlighted text to remove it. This is
              useful for creating interactive annotation systems where users can
              easily remove highlights they no longer need.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
}
