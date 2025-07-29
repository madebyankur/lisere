'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Field as FieldPrimitive } from '@base-ui-components/react';

function Label({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Root>
      <FieldPrimitive.Label
        data-slot="label"
        className={cn(
          'text-primary flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
          className,
        )}
        {...props}
      />
    </FieldPrimitive.Root>
  );
}

export { Label };
