'use client';

import { capitalize, cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

const clothingItems = [
  { id: 1, name: 't-shirts' },
  { id: 2, name: 'shorts' },
  { id: 3, name: 'shirts' },
  { id: 4, name: 'hoodies' },
  { id: 5, name: 'jeans' },
];

const iconEntries = Object.entries(Icons);

const clothingItemsWithIcons = clothingItems.map((item) => {
  return {
    ...item,
    icon: iconEntries
      .find((entry) => item.name === entry[0].toLowerCase())
      ?.at(1),
  };
});

const ClothingCheckbox = () => {
  const [checkedClothingItems, setCheckedClothingItems] = useState(
    new Map<number, string>(),
  );

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm">
      {clothingItemsWithIcons.map((clothing, i) => (
        <Checkbox.Root
          key={clothing.id}
          name={clothing.name}
          value={clothing.id}
          id={`clothing-${clothing.name}`}
          className={cn(
            'flex items-center gap-1 rounded-lg border-none bg-black/5 px-2 py-2 font-medium text-black/60 outline-none transition-all duration-200',
            'hover:bg-black/10',
            'focus-visible:ring-2 focus-visible:ring-black',
            'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
          )}
          checked={checkedClothingItems.has(clothing.id)}
          onCheckedChange={(checked) => {
            const checkedClothingItemsCopy = new Map(checkedClothingItems);
            if (checked) {
              if (
                [...checkedClothingItemsCopy.keys()].length + 1 ===
                clothingItems.length
              ) {
                checkedClothingItemsCopy.clear();
              } else checkedClothingItemsCopy.set(clothing.id, clothing.name);
            } else {
              checkedClothingItemsCopy.delete(clothing.id);
            }
            setCheckedClothingItems(checkedClothingItemsCopy);
          }}
        >
          {clothing.icon && <clothing.icon className="h-[18px]" />}
          {!clothing.icon && (
            <div className="aspect-square w-[24px] rounded-full bg-black" />
          )}

          <label
            className="cursor-pointer"
            htmlFor={`clothing-${clothing.name}`}
          >
            {capitalize(clothing.name)}
          </label>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default ClothingCheckbox;
