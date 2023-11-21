import { cn } from '@/lib/util';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

const Logo = ({
  className,
  ...props
}: {
  props?: HTMLAttributes<HTMLSpanElement>;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'inline-block select-none flex-col font-integral-cf text-[2rem] font-bold leading-none',
        className,
      )}
      {...props}
    >
      Clothy
    </span>
  );
};
export default Logo;
