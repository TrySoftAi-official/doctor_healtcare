import * as React from 'react';

import { Input } from './input';

import { cn } from '@/lib/utils';

function toLocalInputValue(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export interface DateTimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string | null;
  onChange?: (isoOrNull: string | null) => void;
}

const DateTimePicker = React.forwardRef<HTMLInputElement, DateTimePickerProps>(
  ({ value, onChange, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="datetime-local"
        value={toLocalInputValue(value)}
        onChange={e => {
          const v = e.target.value;
          onChange?.(v ? new Date(v).toISOString() : null);
        }}
        className={cn('h-8 w-auto text-sm', className)}
        {...props}
      />
    );
  },
);
DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
