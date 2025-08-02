'use client';

import React, { useState } from 'react';
import { TextHighlighter } from 'lisere';

import { Label } from '@/components/ui/label';
import { Preview } from '@/components/ui/preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeaderLink } from '@/components/ui/header-link';

export function CustomStylingExample() {
  const [selectedStyle, setSelectedStyle] = useState('default');

  const styles = {
    default: { className: '' },
    yellow: {
      className:
        'bg-yellow-50 outline outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]',
    },
    green: {
      className:
        'bg-emerald-50 outline outline-emerald-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-emerald-900/20 rounded-[6px]',
    },
    blue: {
      className:
        'bg-blue-50 outline outline-blue-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-blue-900/20 rounded-[6px]',
    },
    pink: {
      className:
        'bg-pink-50 outline outline-pink-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-pink-900/20 rounded-[6px]',
    },
    purple: {
      className:
        'bg-purple-50 outline outline-purple-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-purple-900/20 rounded-[6px]',
    },
    gradient: {
      className:
        'bg-gradient-to-br from-orange-50 to-orange-100 outline outline-orange-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-orange-900/20 rounded-[6px]',
    },
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <HeaderLink
            id="custom-styling-link"
            aria-labelledby="custom-styling-link"
            aria-label="Custom Styling"
            href="#custom-styling"
            className="ring-ring group block flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Custom Styling
          </HeaderLink>
          <div className="flex items-center gap-2">
            <Label
              id="highlight-style-label"
              aria-labelledby="highlight-style-label"
              htmlFor="highlight-style-select"
              className="text-secondary block text-base font-semibold sm:text-sm"
            >
              Style:
            </Label>

            <Select
              id="highlight-style-select"
              name="highlight-style-select"
              aria-labelledby="highlight-style-select"
              value={selectedStyle}
              onValueChange={value => setSelectedStyle(value as string)}
            >
              <SelectTrigger
                className="min-w-[120px]"
                aria-label="Highlight Style"
              >
                <SelectValue>
                  {selectedStyle.charAt(0).toUpperCase() +
                    selectedStyle.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={0}
              >
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-accent mb-4 text-pretty">
          Choose different highlight styles and see how they apply to new
          selections.
        </p>
      </div>

      <Preview
        code={`<TextHighlighter
  highlightStyle={{
    style: {
      background: 'linear-gradient(45deg, #f3e8ff, #faf5ff)',
      color: '#431407',
      padding: '2px',
      borderRadius: '8px',
      boxShadow: '0 0 0 1px rgba(126,34,206,0.1), 0 1px 2px -1px rgb(126,34,206), 0 1px 4px -2px rgba(126,34,206,0.1), 0 4px 8px -4px rgba(126,34,206,0.1)',
      cursor: 'crosshair',
    }
  }}
>
  <p>Your content here...</p>
</TextHighlighter>`}
        preview={
          <TextHighlighter
            highlightStyle={
              selectedStyle === 'default'
                ? undefined
                : styles[selectedStyle as keyof typeof styles]
            }
          >
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This paragraph demonstrates custom styling options. Select any
              text to see how the chosen style is applied. You can customize
              highlights using CSS classes, inline styles, or a combination of
              both. The styling system is flexible and allows for complex visual
              effects.
            </p>
          </TextHighlighter>
        }
      />
    </div>
  );
}
