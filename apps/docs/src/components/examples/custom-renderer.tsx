'use client';

import React from 'react';
import { TextHighlighter, type TextSelection } from 'lisere';

import { Preview } from '@/components/ui/preview';
import { HeaderLink } from '@/components/ui/header-link';

export function CustomRendererExample() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="custom-renderer-link"
          aria-labelledby="custom-renderer-link"
          aria-label="Custom Renderer"
          href="#custom-renderer"
        >
          Custom Render Props
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Use render props to completely customize how highlights are displayed.
        </p>
      </div>

      <Preview
        code={`<TextHighlighter
  renderHighlight={({
    children,
    selection,
  }: {
    children: React.ReactNode;
    selection: TextSelection;
  }) => (
    <span
      title={\`Highlighted: "\${selection.text}"\`}
      style={{
        background: 'linear-gradient(45deg, #f3e8ff, #faf5ff)',
        color: '#431407',
        padding: '2px',
        borderRadius: '8px',
        boxShadow: '0 0 0 1px rgba(126,34,206,0.1), 0 1px 2px -1px rgb(126,34,206), 0 1px 4px -2px rgba(126,34,206,0.1), 0 4px 8px -4px rgba(126,34,206,0.1)',
        cursor: 'crosshair',
      }}
    >
      {children} 🍒
    </span>
  )}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            renderHighlight={({
              children,
              selection,
            }: {
              children: React.ReactNode;
              selection: TextSelection;
            }) => (
              <span
                title={`Highlighted: "${selection.text}"`}
                style={{
                  background: 'linear-gradient(45deg, #f3e8ff, #faf5ff)',
                  color: '#431407',
                  padding: '2px',
                  borderRadius: '8px',
                  boxShadow:
                    '0 0 0 1px rgba(126,34,206,0.1), 0 1px 2px -1px rgb(126,34,206), 0 1px 4px -2px rgba(126,34,206,0.1), 0 4px 8px -4px rgba(126,34,206,0.1)',
                  cursor: 'crosshair',
                }}
              >
                {children} 🍒
              </span>
            )}
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This example shows how to use custom render props to create unique
              highlight styles. The highlights here have a gradient background,
              a sparkle emoji, and a tooltip showing the highlighted text. You
              can create any custom UI for your highlights using this approach.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
}
