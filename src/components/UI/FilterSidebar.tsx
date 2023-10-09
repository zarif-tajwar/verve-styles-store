import { useShopFilterStore } from '@/lib/store/shop-filter';
import { Icons } from '../Svgs/icons';
import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';

export const FilterSidebar = () => {
  return (
    <>
      <div className="w-full max-w-[296px]">
        <div className="rounded-main border border-black/10 px-6 pb-8 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-plus-jakarta-sans text-xl font-bold capitalize">
              Filters
            </h2>
            <Icons.filter className="text-black/40" />
          </div>
          <VerticalDivider />
          <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
            Clothing
          </h3>
          <ClothingCheckbox />

          <VerticalDivider />
          <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
            Price
          </h3>
          <DoubleRangeSlider />
          <VerticalDivider />
          <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
            Size
          </h3>
          <SizesCheckbox />
          <VerticalDivider />
          <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
            Dress Style
          </h3>
          <DressStyleCheckbox />
        </div>
      </div>
    </>
  );
};

const VerticalDivider = () => (
  <div className="my-6 h-px w-full bg-black/10"></div>
);
