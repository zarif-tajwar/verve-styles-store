import { cn } from '@/lib/util';
import { Loader, LucideProps } from 'lucide-react';

const Spinner = ({ className, ...props }: LucideProps) => {
  return (
    <Loader
      {...props}
      className={cn('animate-spin text-primary-200', className)}
    />
  );
};
export default Spinner;
