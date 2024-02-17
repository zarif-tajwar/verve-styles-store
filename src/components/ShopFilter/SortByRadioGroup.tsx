'use client';

import { useShopFilter } from '@/lib/hooks/useShopFilter';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  defaultSortOptionValue,
  sortOptions,
} from '@/lib/validation/constants';
import { Button } from '../UI/Button';

const SortByRadioGroup = () => {
  const singleOptionCheck = useShopFilter((store) => store.singleOptionCheck);

  const { currentOptionValue, handleValueChange } =
    singleOptionCheck('sort_by');
  return (
    <div className="">
      <RadioGroup.Root
        onValueChange={handleValueChange}
        value={currentOptionValue || defaultSortOptionValue}
        className="grid grid-cols-2 gap-2"
      >
        {sortOptions.map((option) => {
          return (
            <RadioGroup.Item asChild value={option.value} key={option.value}>
              <Button
                variant={'secondary'}
                className="data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0"
                align={'left'}
                roundness={'lg'}
              >
                {option.title}
              </Button>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>
    </div>
  );
};
export default SortByRadioGroup;
