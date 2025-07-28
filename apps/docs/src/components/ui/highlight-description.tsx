'use client';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { TextHighlighter } from 'lisere';

function HighlightDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-accent mb-8 text-pretty text-xl', className)}>
      <TextHighlighter containerElement="span">
        {children as any}
      </TextHighlighter>
    </p>
  );
}

export { HighlightDescription };
