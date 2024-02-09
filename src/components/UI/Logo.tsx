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
        'inline-flex flex-col gap-x-2 font-geist text-xl/none font-black uppercase sm:text-2xl/none md:flex-row md:text-3xl/none',
        className,
      )}
      {...props}
    >
      Verve <span className="ml-px text-primary-400 md:ml-0">Styles</span>
    </span>
  );
};
export default Logo;
