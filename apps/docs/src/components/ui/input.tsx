import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input as InputPrimitive } from '@base-ui-components/react';

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'file:text-primary hover:border-accent/25 placeholder:text-muted-foreground selection:bg-primary selection:text-primary text-primary border-input shadow-xs bg-card flex h-10 w-full min-w-0 rounded-2xl border px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:text-sm',
        'focus-visible:border-ring/20 focus-visible:ring-ring focus-visible:ring-2',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
