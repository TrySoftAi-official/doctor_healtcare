'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { cn } from '@/lib/utils';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export default function Loader({ delay = 400, className, ...props }: LoaderProps) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center text-muted-foreground',
        className,
      )}
      {...props}
    >
      <Spinner size="large" />
    </div>
  );
}
