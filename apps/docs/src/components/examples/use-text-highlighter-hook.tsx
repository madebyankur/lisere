'use client';

import { Trash } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTextHighlighter, type TextSelection } from 'lisere';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Preview } from '@/components/ui/preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { HeaderLink } from '@/components/ui/header-link';

export function HookExample() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [highlightColor, setHighlightColor] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  const colorOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Pink', value: 'pink' },
    { label: 'Purple', value: 'purple' },
    { label: 'Gradient', value: 'gradient' },
  ];

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

  const { highlights, highlightText, removeHighlight, clearHighlights } =
    useTextHighlighter({
      containerRef,
      highlightStyle: {
        className: styles[highlightColor as keyof typeof styles]?.className,
      },
    });

  const handleSearchHighlight = () => {
    if (searchTerm.trim()) {
      highlightText(searchTerm.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchHighlight();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="mx-6 mb-6 space-y-2">
        <HeaderLink
          id="use-text-highlighter-hook-link"
          aria-labelledby="use-text-highlighter-hook-link"
          aria-label="Use TextHighlighter Hook"
          href="#use-text-highlighter-hook"
        >
          useTextHighlighter Hook
        </HeaderLink>
        <p className="text-accent mb-4 text-pretty">
          Use the hook for more control over highlighting behavior.
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
                id="hook-input-label"
                htmlFor="hook-input"
                className="text-secondary hidden text-sm font-semibold"
              >
                Search Text
              </Label>
              <Input
                id="hook-input"
                name="hook-input"
                aria-labelledby="hook-input"
                aria-label="Search Text"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Enter text to highlight"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label
                id="hook-select-label"
                htmlFor="hook-select"
                className="text-secondary hidden text-sm font-semibold"
              >
                Color
              </Label>
              <Select
                id="hook-select"
                name="hook-select"
                aria-labelledby="hook-select"
                aria-label="Color"
                value={highlightColor}
                onValueChange={value => setHighlightColor(value as string)}
              >
                <SelectTrigger className="w-full min-w-32" aria-label="Color">
                  <SelectValue>
                    {
                      colorOptions.find(
                        option => option.value === highlightColor,
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      aria-label={option.label}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            id="hook-button"
            name="hook-button"
            aria-labelledby="hook-button"
            aria-label="Highlight"
            className="w-full self-end sm:w-auto"
            onClick={handleSearchHighlight}
          >
            Highlight
          </Button>
        </form>
      </div>

      <Preview
        code={`  const { highlights, highlightText, clearHighlights } = useTextHighlighter({
    containerRef,
    highlightStyle: { style: { backgroundColor: "${highlightColor}" } },
    onTextHighlighted: (selection: TextSelection) => {
      console.log("Highlighted:", selection.text);
    },
  });
`}
        preview={
          <div ref={containerRef} style={{ userSelect: 'text' }}>
            <p className="text-accent text-pretty font-medium leading-relaxed">
              This demonstration shows how to use the useTextHighlighter hook
              for more advanced control. You can programmatically highlight
              text, change colors dynamically, clear highlights, and get the
              current text selection. The hook provides a more flexible API for
              complex use cases where you need fine-grained control over the
              highlighting behavior.
            </p>
          </div>
        }
      />

      <div
        className={cn(
          'ease-in-out-circ mx-5 my-6 duration-200',
          highlights.length > 0
            ? 'animate-in fade-in-0 block scale-100 blur-none'
            : 'animate-out fade-out-0 hidden scale-50 blur-xl',
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="mb-2 flex gap-2 text-sm font-semibold text-gray-700">
            Active Highlights{' '}
            <span className="bg-accent/10 text-accent mr-1.5 flex h-5 w-5 items-center justify-center rounded-lg text-xs">
              {highlights.length}
            </span>
          </h3>
          <Button
            id="clear-all-button"
            name="clear-all-button"
            aria-labelledby="clear-all-button"
            variant="destructive"
            onClick={clearHighlights}
          >
            Clear All
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {highlights.map((highlight: TextSelection, index: number) => (
            <div
              key={index}
              className="bg-card border-border text-accent flex items-center gap-2 rounded-2xl border py-1.5 pl-2.5 pr-1.5 text-sm font-medium"
            >
              {highlight.text}
              <Button
                id={`remove-highlight-${index}`}
                name={`remove-highlight-${index}`}
                aria-labelledby={`remove-highlight-${index}`}
                variant="destructive"
                size="sm"
                className="bg-destructive/50 rounded-lg border-none shadow-none"
                onClick={() => removeHighlight(highlight)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
