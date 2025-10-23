import * as React from 'react';

import { cn } from '@/lib/utils';

const Listbox = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      multiple
      ref={ref}
      className={cn('h-40 w-full border rounded-md p-2', className)}
      {...props}
    />
  ),
);
Listbox.displayName = 'Listbox';

export { Listbox };
