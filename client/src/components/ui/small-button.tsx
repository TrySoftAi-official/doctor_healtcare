import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SmallButton = React.forwardRef<HTMLButtonElement, SmallButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
SmallButton.displayName = 'SmallButton';

export { SmallButton };
