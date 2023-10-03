'use client';

import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';

const clothingItems = [
  { id: 1, value: 'tshirts', label: 'T-Shirts', icon: Icons['T-Shirts'] },
  { id: 2, value: 'shorts', label: 'Shorts', icon: Icons.Shorts },
  { id: 3, value: 'shirts', label: 'Shirts', icon: Icons.Shirts },
  { id: 4, value: 'hoodies', label: 'Hoodies', icon: Icons.Hoodies },
  { id: 5, value: 'jeans', label: 'Jeans', icon: Icons.Jeans },
];

const ClothingCheckbox = () => {
  const { isChecked, handleCheck } = useMultiCheckboxSearchQuery({
    options: clothingItems,
    searchQueryKey: 'clothing',
  });

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm">
      {clothingItems.map((clothing) => (
        <Checkbox.Root
          key={clothing.value}
          name={clothing.label}
          value={clothing.value}
          className={cn(
            'flex items-center gap-1 rounded-lg border-none bg-black/5 px-2 py-2 font-medium text-black/60 outline-none transition-all duration-200',
            'hover:bg-black/10',
            'focus-visible:ring-2 focus-visible:ring-black',
            'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
          )}
          checked={isChecked(clothing.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, clothing.value, false);
          }}
        >
          {clothing.icon && <clothing.icon className="h-[18px]" />}
          {!clothing.icon && (
            <div className="aspect-square w-[24px] rounded-full bg-black" />
          )}

          <div>{clothing.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default ClothingCheckbox;
