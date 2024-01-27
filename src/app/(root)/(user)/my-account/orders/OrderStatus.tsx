import {
  ArrowUTurnRightMicro,
  CheckMicro,
  DocumentCheckMicro,
  DocumentListMicro,
  TruckMicro,
  XMicro,
} from '@/components/Svgs/icons';
import { cn } from '@/lib/util';

const OrderStatus = ({
  status,
  className,
}: {
  status: string | undefined;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        '-ml-2 flex w-max items-center gap-1 rounded-full bg-primary-50 px-2 py-1 font-medium capitalize text-primary-500',
        status === 'delivered' && 'bg-emerald-50 text-emerald-600',
        status === 'out for delivery' && 'bg-sky-50 text-sky-700',
        status === 'cancelled' && 'bg-rose-50 text-rose-700',
        status === 'confirmed' && 'text-emerald-700',
        status === 'processing' && 'text-lime-700',
        // status === 'returned' && 'text-red-700/80',
        className,
      )}
    >
      {status === 'out for delivery' && <TruckMicro />}
      {status === 'delivered' && <CheckMicro />}
      {status === 'cancelled' && <XMicro />}
      {status === 'confirmed' && <DocumentCheckMicro />}
      {status === 'processing' && <DocumentListMicro />}
      {status === 'returned' && <ArrowUTurnRightMicro />}
      {status}
    </span>
  );
};
export default OrderStatus;
