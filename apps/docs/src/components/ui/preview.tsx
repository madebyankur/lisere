'use client';
import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const Preview = ({
  preview,
  code,
}: {
  preview: React.ReactNode;
  code: string;
}) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLPreElement>) => {
    if (!showCode) return;

    const element = e.currentTarget;
    const scrollAmount = 20;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        element.scrollTop += scrollAmount;
        break;
      case 'ArrowUp':
        e.preventDefault();
        element.scrollTop -= scrollAmount;
        break;
      case 'PageDown':
        e.preventDefault();
        element.scrollTop += element.clientHeight;
        break;
      case 'PageUp':
        e.preventDefault();
        element.scrollTop -= element.clientHeight;
        break;
      case 'Home':
        e.preventDefault();
        element.scrollTop = 0;
        break;
      case 'End':
        e.preventDefault();
        element.scrollTop = element.scrollHeight;
        break;
    }
  };

  return (
    <div className="border-border shadow-tiny bg-card overflow-hidden rounded-[30px] border">
      <div className="bg-card px-6 pb-4 pt-6">{preview}</div>

      <div className="relative p-0.5">
        <div
          className="from-accent/5 pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-24 w-full bg-gradient-to-t to-transparent px-10 py-6 backdrop-blur-2xl"
          style={{
            maskImage: 'linear-gradient(to top, rgb(0, 0, 0) 15%, transparent)',
          }}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              id="copy-code-button"
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
              className={cn(
                'text-accent focus-visible:ring-ring bg-contrast/5 hover:border-contrast/5 hover:bg-contrast/10 pointer-events-auto absolute right-4 top-4 z-50 select-none overflow-hidden rounded-full border border-transparent px-2 py-1 text-sm font-semibold outline-none backdrop-blur-sm transition duration-150 focus-visible:ring-2',
                showCode
                  ? 'pointer-events-auto opacity-100 ease-in'
                  : 'pointer-events-none opacity-0 ease-out',
              )}
              tabIndex={showCode ? 0 : -1}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <button
          id="show-code-button"
          aria-label={showCode ? 'Hide code' : 'Show code'}
          aria-expanded={showCode}
          aria-controls="code-preview"
          className="text-accent hover:text-secondary focus-visible:ring-ring hover:border-contrast/5 hover:bg-contrast/10 pointer-events-auto absolute bottom-4 left-1/2 z-50 h-8 -translate-x-1/2 select-none overflow-hidden rounded-full border border-transparent px-2.5 py-1 text-sm font-semibold outline-none transition duration-150 ease-out focus-visible:ring-2"
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? 'Hide' : 'Show'} Code
        </button>

        <pre
          id="code-preview"
          className={cn(
            'text-shadow-primary-foreground text-accent bg-accent/5 transition-discrete focus-visible:ring-ring z-10 flex origin-bottom flex-col whitespace-pre-wrap rounded-b-[26px] rounded-t-xl p-6 pb-16 font-mono text-sm leading-relaxed outline-none duration-200 focus-visible:ring',
            showCode
              ? 'max-h-[40rem] overflow-auto opacity-100 blur-0  ease-in'
              : 'blur-xs max-h-12 overflow-hidden opacity-50 ease-out',
          )}
          tabIndex={showCode ? 0 : -1}
          role="textbox"
          aria-label="Code example"
          aria-readonly="true"
          onKeyDown={handleCodeKeyDown}
        >
          {code.split('\n').map((line, index) => (
            <code className="flex" key={index}>
              <span className="text-accent/50 mr-6 touch-none select-none">
                {index + 1}
              </span>
              <span className="text-primary">{line}</span>
            </code>
          ))}
        </pre>
      </div>
    </div>
  );
};
