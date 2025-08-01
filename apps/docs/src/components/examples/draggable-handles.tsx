'use client';

import { useState } from 'react';
import { TextHighlighter, type TextSelection } from 'lisere';
import { HeaderLink } from '@/components/ui/header-link';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Preview } from '@/components/ui/preview';
export const DraggableHandlesExample = () => {
  const [showHandles, setShowHandles] = useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="show-draggable-handles-link"
          aria-labelledby="show-draggable-handles-link"
          aria-label="Show Draggable Handles"
          href="#show-draggable-handles"
        >
          Show Draggable Handles
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Enable the toggle below to show draggable handles on the highlighted
          text.
        </p>
      </div>

      <div className="mb-4 ml-4 mr-6 flex items-center">
        <Label
          id="show-draggable-handles-label"
          aria-labelledby="show-draggable-Handles-label"
          htmlFor="show-draggable-handles"
          className="hover:bg-accent/10 flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition-colors duration-150 ease-out"
        >
          <Checkbox
            id="show-draggable-handles"
            aria-labelledby="show-draggable-handles"
            checked={showHandles}
            onCheckedChange={() => setShowHandles(!showHandles)}
          />
          Show Draggable Handles
        </Label>
      </div>

      <Preview
        code={`<TextHighlighter
  showDraggableHandles={true}
  onTextHighlighted={(selection: TextSelection) => {
    console.log('Highlighted:', selection.text)
  }}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter showDraggableHandles={showHandles}>
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This demo shows how to show draggable handles on the highlighted
              text. First, select some text to highlight it. Then, if the toggle
              is enabled, you can drag the handles to resize the highlighted
              text.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
};
