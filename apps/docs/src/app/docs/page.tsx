import Link from 'next/link';
import React from 'react';

import { BasicExample } from '@/components/examples/basic';
import { CustomRendererExample } from '@/components/examples/custom-renderer';
import { CustomStylingExample } from '@/components/examples/custom-styling';
import { HookExample } from '@/components/examples/use-text-highlighter-hook';
import { PreselectedExample } from '@/components/examples/pre-selected-content';
import { RemoveHighlightExample } from '@/components/examples/remove-highlight';
import { SelectionBoundaryExample } from '@/components/examples/selection-boundary';
import { SelectionUIExample } from '@/components/examples/custom-selection-ui';
import { UtilityFunctionsExample } from '@/components/examples/utility-functions';
import { CodeBlock } from '@/components/ui/code-block';
import { HighlightDescription } from '@/components/ui/highlight-description';
import { INSTALL_CMD } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function DocumentationPage() {
  return (
    <div className="animate-in fade-in ease-in-out-circ relative flex h-full min-h-screen items-center justify-center duration-300">
      <div className="z-10 mx-auto w-full max-w-prose px-6 py-20 md:px-0">
        <header className="mb-12 text-center">
          <Link
            id="home-link"
            aria-labelledby="home-link"
            aria-label="Home"
            href="/"
            className="group mx-auto flex w-fit outline-none"
          >
            <h1 className="group-focus-visible:shadow-light group-focus-visible:bg-accent/10 text-shadow-xs text-shadow-primary-foreground/90 transition-discrete text-primary hover:bg-accent/10 hover:shadow-light mb-4 w-fit rounded-2xl px-2 pb-1 pt-1.5 font-serif text-6xl tracking-tight duration-200 ease-out">
              Liseré
            </h1>
          </Link>
          <HighlightDescription>
            A lightweight and composable React component for selecting and
            highlighting text.
          </HighlightDescription>
        </header>

        <Separator />

        <div className="space-y-12 sm:space-y-20">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="mx-6 mb-6 space-y-2">
              <h2 className="text-primary text-2xl font-semibold">
                Installation
              </h2>
              <p className="text-accent text-pretty">
                <Link
                  id="installation-link"
                  aria-labelledby="installation-link"
                  aria-label="Installation"
                  href="https://www.npmjs.com/package/lisere"
                  className="hover:text-primary focus-visible:ring-ring select-none rounded-sm underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install
                </Link>{' '}
                the package via npm, yarn, or your package manager of choice.
              </p>
            </div>

            <CodeBlock tabs={INSTALL_CMD} active={INSTALL_CMD[0]} />
          </div>

          <Separator />
          <BasicExample />
          <Separator />
          <CustomStylingExample />
          <Separator />
          <SelectionBoundaryExample />
          <Separator />
          <CustomRendererExample />
          <Separator />
          <SelectionUIExample />
          <Separator />
          <PreselectedExample />
          <Separator />
          <RemoveHighlightExample />
          <Separator />
          <HookExample />
          <Separator />
          <UtilityFunctionsExample />
        </div>

        <footer className="bg-background border-muted mx-auto mt-12 w-full border-t border-dashed p-8 text-center text-sm md:max-w-sm">
          <p className="mb-2">2025 Liseré</p>
          <p>
            Built by{' '}
            <a
              id="personal-link"
              aria-labelledby="personal-link"
              aria-label="Ankur Chauhan"
              href="https://ankur.design"
              className="hover:text-primary focus-visible:ring-ring select-none rounded-sm underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ankur Chauhan
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
