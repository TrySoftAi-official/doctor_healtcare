import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  autoResize?: boolean;
  maxHeight?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, maxHeight = '200px', ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    const handleResize = React.useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const maxHeightPx = parseInt(maxHeight);

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';

      // Calculate the new height
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeightPx);

      // Set the height
      textarea.style.height = `${newHeight}px`;

      // Show scrollbar only when content exceeds maxHeight
      if (scrollHeight > maxHeightPx) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }, [autoResize, maxHeight]);

    React.useEffect(() => {
      if (autoResize) {
        handleResize();
      }
    }, [autoResize, handleResize]);

    // Handle resize when value changes
    React.useEffect(() => {
      if (autoResize) {
        handleResize();
      }
    }, [autoResize, handleResize, props.value]);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        handleResize();
      }
      // Call the original onInput if provided
      if (props.onInput) {
        props.onInput(e);
      }
    };

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-lg border border-[#bfbfbd] bg-transparent px-3 py-2 text-[20px] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        style={autoResize ? { maxHeight } : undefined}
        ref={textareaRef}
        onInput={handleInput}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
