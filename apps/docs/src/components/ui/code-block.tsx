'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Tabs {
  label: string;
  value: string;
}

const CodeBlock = ({ tabs, active }: { tabs: Tabs[]; active?: Tabs }) => {
  const [activeTab, setActiveTab] = useState(active || tabs[0]);
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(activeTab.value);
    setCopied(true);
    setTooltipOpen(true);
    setTimeout(() => {
      setCopied(false);
      setTooltipOpen(false);
    }, 2000);
  }, [activeTab.value]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTabFocused = tabRefs.current.some(
        (ref: HTMLButtonElement | null) => ref === activeElement,
      );

      if (e.key === 'ArrowRight') {
        if (tabs.indexOf(activeTab) < tabs.length - 1) {
          const nextTab = tabs[tabs.indexOf(activeTab) + 1];
          setActiveTab(nextTab);

          const nextTabIndex = tabs.indexOf(nextTab);
          tabRefs.current[nextTabIndex]?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        if (tabs.indexOf(activeTab) > 0) {
          const prevTab = tabs[tabs.indexOf(activeTab) - 1];
          setActiveTab(prevTab);

          const prevTabIndex = tabs.indexOf(prevTab);
          tabRefs.current[prevTabIndex]?.focus();
        }
      }
      if (e.key === 'Enter' && isTabFocused) {
        handleCopy();
      }

      return;
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, tabs, handleCopy]);

  return (
    <div className="border-border shadow-tiny bg-card grid w-full gap-2 overflow-hidden rounded-[30px] border">
      <div className="flex w-full items-center justify-between px-3 pt-3">
        <div
          role="tablist"
          className="bg-accent/5 space-x-0.5 rounded-2xl p-0.5"
        >
          {tabs.map((key, index) => (
            <button
              key={index}
              type="button"
              tabIndex={0}
              id={`tab-${key.label}`}
              aria-label={`Switch to ${key.label} tab`}
              role="tab"
              ref={el => {
                tabRefs.current[index] = el;
              }}
              className={cn(
                'ease-in-out-circ text-accent focus-visible:ring-ring transition-discrete select-none rounded-[14px] border border-transparent px-2 py-1 text-sm font-semibold outline-none duration-150 focus-visible:ring-2',
                activeTab.label === key.label
                  ? 'bg-card border shadow-sm'
                  : 'hover:bg-accent/10',
              )}
              onClick={() => setActiveTab(key)}
            >
              {key.label}
            </button>
          ))}
        </div>

        <TooltipProvider delay={0}>
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger
              className="text-accent focus-visible:ring-ring hover:border-contrast/5 hover:bg-contrast/10 pointer-events-auto select-none overflow-hidden rounded-full border border-transparent px-2 py-1 text-sm font-semibold outline-none backdrop-blur-sm transition duration-150 focus-visible:ring-2"
              onClick={handleCopy}
              onMouseEnter={() => !copied && setTooltipOpen(true)}
              onMouseLeave={() => !copied && setTooltipOpen(false)}
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            >
              {copied ? 'Copied' : 'Copy'}
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <pre className="p-0.5">
        <code className="bg-accent/5 text-accent flex h-full w-full rounded-b-[28px] rounded-t-lg px-6 py-4 font-mono text-sm">
          {activeTab.value}
        </code>
      </pre>
    </div>
  );
};

export { CodeBlock };
