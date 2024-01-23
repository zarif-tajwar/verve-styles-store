import { capitalize, cn } from '@/lib/util';

export const formatSizeText = (sizeText: string) =>
  sizeText.length > 3 ? capitalize(sizeText) : sizeText.toUpperCase();

const SizeBadge = ({
  sizeText,
  className,
}: {
  sizeText: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'mb-2 inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide ring-1  ring-inset ring-primary-100',
        className,
      )}
    >
      {formatSizeText(sizeText)}
    </span>
  );
};
export default SizeBadge;
