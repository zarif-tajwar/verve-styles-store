import * as React from 'react';

import { cn } from '@/lib/util';
import { Button } from './Button';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border-primary-100 bg-primary-50 px-3 py-2 text-sm ring-0 ring-transparent transition-all duration-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export interface PasswordInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {}

const PasswordInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  PasswordInputProps
>(({ className, type, ...props }, ref) => {
  const [isVisible, setVisible] = React.useState(false);
  return (
    <Input
      ref={ref}
      {...props}
      type={isVisible ? 'text' : 'password'}
      className="relative"
    >
      <Button
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setVisible(!isVisible)}
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </Input>
  );
});

PasswordInput.displayName = 'PasswordInput';

export { Input, PasswordInput };
