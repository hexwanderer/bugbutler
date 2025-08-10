'use client';

import { cn } from '@workspace/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const animatedButtonVariants = cva(
  'relative flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md font-medium text-xs outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        ghost: 'text-foreground',
        default: 'bg-primary text-primary-foreground hover:text-primary',
        outline: 'isolate border bg-transparent text-foreground',
      },
      size: {
        sm: 'h-8 gap-1 px-3',
        md: 'h-9 px-4',
        lg: 'h-10 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  fillColor?: string; // Tailwind bg-* class for the fill
}

export function AnimatedButton({
  className,
  variant,
  size,
  fillColor = 'bg-accent',
  children,
  ...props
}: AnimatedButtonProps) {
  const fillPosition =
    variant === 'outline'
      ? 'before:inset-[1px] before:h-[calc(100%-2px)] hover:before:w-[calc(100%-2px)]'
      : 'before:inset-0 before:h-full hover:before:w-full';

  return (
    <button
      {...props}
      className={cn(
        animatedButtonVariants({ variant, size }),
        'before:absolute before:z-0 before:w-0 before:origin-left before:transition-all before:duration-300 before:ease-in-out',
        fillPosition,
        `before:${fillColor}`,
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
