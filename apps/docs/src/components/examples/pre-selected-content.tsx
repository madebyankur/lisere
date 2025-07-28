'use client';

import React from 'react';
import { TextHighlighter } from 'lisere';

import { Preview } from '@/components/ui/preview';
import { HeaderLink } from '@/components/ui/header-link';

export function PreselectedExample() {
  const preselectedContent = [
    { text: 'pre-selected', startOffset: 0, endOffset: 12 },
    { text: 'automatically', startOffset: 0, endOffset: 13 },
    { text: 'component', startOffset: 0, endOffset: 9 },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="pre-selected-content-link"
          aria-labelledby="pre-selected-content-link"
          aria-label="Pre-selected Content"
          href="#pre-selected-content"
        >
          Pre-selected Content
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Highlight specific text automatically when the component mounts.
          Useful for displaying saved highlights or annotations.
        </p>
      </div>

      <Preview
        code={`<TextHighlighter
  selectedContent={[
    { text: 'important', startOffset: 0, endOffset: 9 },
    { text: 'keyword', startOffset: 0, endOffset: 7 }
  ]}
>
  <p>Your content with important keywords here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            selectedContent={preselectedContent}
            highlightStyle={{
              className:
                'bg-purple-50 outline outline-purple-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-purple-900/20 rounded-[6px]',
            }}
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This paragraph has some pre-selected text that gets highlighted
              automatically when the component loads.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
}
