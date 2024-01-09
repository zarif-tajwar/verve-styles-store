'use client';

import { Button } from '@/components/UI/Button';
import { cn } from '@/lib/util';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const SelectStatus = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Button
      variant={'outline'}
      size={'sm'}
      roundness={'lg'}
      className="min-w-48 justify-between"
      onClick={() => setSelected(!selected)}
    >
      Select Status
      <span className="relative size-4 text-primary-400">
        <ChevronDown
          className={cn(
            'absolute -top-0.5 right-0 rotate-180 transition-all duration-200',
            selected && '-bottom-0.5 top-auto',
          )}
          size={12}
          strokeWidth={2}
        />
        <ChevronDown
          size={12}
          className={cn(
            'absolute -bottom-0.5 right-0 transition-all duration-200',
            selected && '-top-0.5 bottom-auto',
          )}
          strokeWidth={2}
        />
      </span>
    </Button>
  );
};
export default SelectStatus;
