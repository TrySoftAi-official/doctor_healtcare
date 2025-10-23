import * as React from 'react';

import { Input } from './input';

import { cn } from '@/lib/utils';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => (
    <Input type="date" className={cn('w-full', className)} ref={ref} {...props} />
  ),
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };
