import { cn } from '@/lib/util';
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
        'inline-block select-none flex-col font-integral-cf text-[1.75rem] font-bold leading-none',
        className,
      )}
      {...props}
    >
      Verve&nbsp;&nbsp;Styles
    </span>
  );
};
export default Logo;
