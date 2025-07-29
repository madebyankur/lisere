'use client';

import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useRender } from '@base-ui-components/react/use-render';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-discrete disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive select-none",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-background border border-destructive-foreground/10 text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border-2 bg-background text-primary border-border shadow-xs hover:bg-muted/25 hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-muted/25 hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-6 gap-1.5 px-1 has-[>svg]:px-1 rounded-lg',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  render = <button />,
  ...props
}: useRender.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  }) {
  return useRender({
    render,
    props: {
      'data-slot': 'button',
      className: cn(buttonVariants({ variant, size, className })),
      ...props,
    },
  });
}

export { Button, buttonVariants };
