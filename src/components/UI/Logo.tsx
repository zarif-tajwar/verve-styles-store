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
        'inline-flex flex-col items-center gap-x-2 font-geist text-2xl/none font-black uppercase md:text-3xl/none [@media(width>=450px)]:flex-row',
        className,
      )}
      {...props}
    >
      Verve{' '}
      <span className="-mt-0.5 ml-0.5 text-primary-400 [@media(width<450px)]:text-xl/none [@media(width>=450px)]:ml-0 [@media(width>=450px)]:mt-0">
        Styles
      </span>
    </span>
    // <span
    //   className={cn(
    //     'inline-flex flex-col items-center gap-x-2 font-geist text-2xl/none font-black uppercase md:text-3xl/none [@media(width>=450px)]:flex-row',
    //     className,
    //   )}
    //   {...props}
    // >
    //   Verve{' '}
    //   <span className="-mt-0.5 ml-1 text-primary-400 [@media(width>=450px)]:ml-0 [@media(width>=450px)]:mt-0">
    //     Styles
    //   </span>
    // </span>
  );
};
export default Logo;
