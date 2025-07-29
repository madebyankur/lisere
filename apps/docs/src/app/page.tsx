import Link from 'next/link';
import React from 'react';

import { HighlightDescription } from '@/components/ui/highlight-description';
import { CodeBlock } from '@/components/ui/code-block';
import { INSTALL_CMD } from '@/lib/constants';
import { Cursor } from '@/components/ui/cursor';
import { GradientOverlay } from '@/components/ui/gradient-overlay';

export default function HomePage() {
  return (
    <div className="animate-in fade-in ease-in-out-circ relative flex h-full min-h-screen items-center justify-center duration-300">
      <div className="mx-auto w-full max-w-prose px-6 py-10 md:px-0 md:py-20">
        <header className="mb-12 text-center">
          <div className="pointer-events-none relative mx-auto mb-4 flex w-fit touch-none">
            <h1
              id="home-title"
              aria-labelledby="home-title"
              aria-label="Liseré"
              className="text-shadow-xs text-shadow-primary-foreground/90 text-primary pointer-events-none z-10 font-serif text-8xl tracking-tight"
            >
              Liseré
            </h1>
            <span className="animate-grow-in-from-left shadow-light bg-accent/5 pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-[calc(100%+1.5rem)] origin-left -translate-x-[calc(50%-0.05rem)] -translate-y-[calc(50%+0.25rem)] touch-none rounded-3xl px-2" />
            <Cursor />
          </div>

          <HighlightDescription>
            A lightweight and composable React component for selecting and
            highlighting text.
          </HighlightDescription>
        </header>

        <div className="mx-auto w-full space-y-8">
          <CodeBlock tabs={INSTALL_CMD} active={INSTALL_CMD[0]} />
        </div>

        <div className="my-12 flex justify-center space-x-2">
          <a
            id="github-link"
            aria-labelledby="github-link"
            aria-label="View on GitHub"
            href="https://github.com/madebyankur/lisere"
            className="border-muted text-accent focus-visible:ring-ring transition-discrete group relative flex select-none items-center justify-center overflow-hidden rounded-2xl border bg-transparent px-5 py-2.5 text-sm font-semibold outline-none duration-150 ease-out  hover:border-orange-500/20 focus-visible:ring-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
            <span className="absolute inset-x-1 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-orange-500/0 from-10% via-orange-400 to-orange-500/0 to-90% opacity-0 transition duration-150 ease-out group-hover:scale-x-100 group-hover:opacity-100"></span>
            <span className="absolute inset-0 origin-bottom scale-0 overflow-hidden opacity-0 transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100">
              <span className="absolute inset-x-6 -bottom-2 h-full rounded-t-full bg-gradient-to-t from-orange-300/25 to-transparent blur"></span>
            </span>
          </a>
          <Link
            id="documentation-link"
            aria-labelledby="documentation-link"
            aria-label="Documentation"
            href="/docs"
            className="bg-primary text-primary-foreground focus-visible:ring-ring hover:bg-contrast transition-discrete group relative flex select-none items-center justify-center overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold outline-none duration-150 ease-out focus-visible:ring-2"
          >
            Documentation
            <span className="from-primary-foreground/0 via-primary-foreground to-primary-foreground/0 absolute inset-x-1 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-25% to-75% opacity-0 transition duration-150 ease-out group-hover:scale-x-100 group-hover:opacity-100"></span>
            <span className="absolute inset-0 origin-bottom scale-0 overflow-hidden opacity-0 transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100">
              <span className="from-primary-foreground/50 absolute inset-x-6 -bottom-2 h-full rounded-t-full bg-gradient-to-t to-transparent blur"></span>
            </span>
          </Link>
        </div>

        <footer className="bg-background border-muted text-accent text-primary fixed bottom-0 left-1/2 w-full -translate-x-1/2 border-t border-dashed p-8 text-center text-sm md:max-w-sm">
          <p className="mb-2">2025 Liseré</p>
          <p>
            Built by{' '}
            <a
              id="personal-link"
              aria-labelledby="personal-link"
              aria-label="Ankur Chauhan"
              href="https://ankur.design"
              className="hover:text-primary text-accent focus-visible:ring-ring select-none rounded-sm underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ankur Chauhan
            </a>
          </p>
        </footer>
      </div>

      <GradientOverlay />
    </div>
  );
}
