'use client';

import { FunnelMini } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { cn } from '@/lib/util';
import { ChevronDown, ChevronsUpDown, Filter } from 'lucide-react';
import { useState } from 'react';

const SelectStatus = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Button
      variant={'outline'}
      size={'sm'}
      roundness={'lg'}
      className="min-w-48 justify-between font-medium text-primary-400"
      onClick={() => setSelected(!selected)}
    >
      Select Order Status
      {/* <Filter size={16} className="text-primary-400" /> */}
      <ChevronsUpDown size={16} className="-mr-0.5 text-primary-400" />
    </Button>
  );
};
export default SelectStatus;
