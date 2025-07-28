'use client';

import React, { useState } from 'react';
import { TextHighlighter } from 'lisere';

import { Label } from '@/components/ui/label';
import { Preview } from '@/components/ui/preview';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HeaderLink } from '@/components/ui/header-link';

export function SelectionBoundaryExample() {
  const [mode, setMode] = useState<'cursor' | 'word'>('cursor');

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="selection-boundary-link"
          aria-labelledby="selection-boundary-link"
          aria-label="Selection Boundary"
          href="#selection-boundary"
        >
          Selection Boundary Modes
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Compare cursor-based vs word-based selection boundaries. Try selecting
          partial words in each mode.
        </p>
      </div>

      <div className="grid gap-4">
        <RadioGroup
          defaultValue="cursor"
          onValueChange={value => setMode(value as 'cursor' | 'word')}
          className="mx-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <Label
            id="cursor-label"
            aria-labelledby="cursor-label"
            htmlFor="cursor"
            className="hover:bg-accent/10 focus-visible:ring-ring flex select-none items-center gap-1.5 rounded-xl p-1.5 pr-2.5 font-medium transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <RadioGroupItem value="cursor" id="cursor" />
            Cursor Boundary (exact selection)
          </Label>

          <Label
            id="word-label"
            aria-labelledby="word-label"
            htmlFor="word"
            className="hover:bg-accent/10 focus-visible:ring-ring flex select-none items-center gap-1.5 rounded-xl p-1.5 pr-2.5 font-medium transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <RadioGroupItem value="word" id="word" />
            Word boundary (default)
          </Label>
        </RadioGroup>

        <Preview
          code={`<TextHighlighter
  selectionBoundary="${mode}"
>
  <p>Your content here...</p>
</TextHighlighter>`}
          preview={
            <TextHighlighter
              selectionBoundary={mode}
              highlightStyle={{
                className:
                  'bg-blue-50 outline outline-blue-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-blue-900/20 rounded-[6px]',
              }}
            >
              <p className="text-accent text-pretty font-medium leading-relaxed">
                Try selecting parts of words like "demonstrat" from
                "demonstration" or "bound" from "boundaries". In cursor mode,
                you'll highlight exactly what you select. In word mode, the
                selection will expand to include complete words. This feature is
                particularly useful for applications like text annotation tools
                where you want consistent highlighting behavior.
              </p>
            </TextHighlighter>
          }
        />
      </div>
    </div>
  );
}
