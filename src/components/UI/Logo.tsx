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
        'inline-flex flex-col gap-x-2 font-geist text-2xl/none font-black uppercase md:text-3xl/none [@media(width>=370px)]:flex-row',
        className,
      )}
      {...props}
    >
      Verve{' '}
      <span className="ml-px text-primary-400 [@media(width>=370px)]:ml-0">
        Styles
      </span>
    </span>
  );
};
export default Logo;
