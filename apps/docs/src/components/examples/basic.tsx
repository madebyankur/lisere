'use client';

import React, { useState } from 'react';
import { TextHighlighter, type TextSelection } from 'lisere';

import { Preview } from '@/components/ui/preview';
import { cn } from '@/lib/utils';
import { HeaderLink } from '@/components/ui/header-link';

export function BasicExample() {
  const [highlights, setHighlights] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="basic-usage-link"
          aria-labelledby="basic-usage-link"
          aria-label="Basic Usage"
          href="#basic-usage"
        >
          Basic Usage
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Select any part of this text. A default highlight will be applied as
          soon as the selection is valid.
        </p>
      </div>

      <Preview
        code={`<TextHighlighter
  onTextHighlighted={(selection: TextSelection) => {
    setHighlights(prev => [...prev, selection.text]);
  }}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            onTextHighlighted={(selection: TextSelection) => {
              setHighlights(prev => [...prev, selection.text]);
            }}
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This component allows you to easily add text highlighting
              functionality to your React applications. Simply select any text
              in this paragraph and it will be highlighted automatically. The
              component is highly customizable and supports various selection
              modes, styling options, and event callbacks.
            </p>
          </TextHighlighter>
        }
      />

      <div
        className={cn(
          'ease-in-out-circ mx-5 mt-6 duration-200',
          highlights.length > 0
            ? 'animate-in fade-in-0 block scale-100 blur-none'
            : 'animate-out fade-out-0 hidden scale-50 blur-xl',
        )}
      >
        <h3
          id="highlighted-text"
          aria-labelledby="highlighted-text"
          aria-label="Highlighted Text"
          className="text-secondary mx-1 mb-2 font-semibold"
        >
          Highlighted Text
        </h3>
        <div className="flex flex-wrap gap-2 text-sm">
          {highlights.map((text, index) => (
            <span
              key={index}
              className="bg-accent/10 text-accent flex items-center rounded-xl py-1 pl-1 pr-2.5 text-sm font-medium"
            >
              <span className="bg-accent/10 mr-1.5 flex h-5 w-5 items-center justify-center rounded-lg font-mono text-xs font-semibold tabular-nums">
                {index + 1}
              </span>
              {text}{' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
