import { cn } from '@/lib/util';
import { Loader, Loader2, LucideProps } from 'lucide-react';

const Spinner = ({
  className,
  variant = 2,
  ...props
}: LucideProps & { variant?: 1 | 2 }) => {
  const Comp = variant === 1 ? Loader2 : Loader;
  return (
    <Comp
      {...props}
      className={cn('animate-spin text-primary-200', className)}
    />
  );
};
export default Spinner;
