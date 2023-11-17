import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';
import { Sliders } from 'lucide-react';

export const FilterSidebar = () => {
  return (
    <div className="sticky top-20 h-max">
      <div className="w-max max-w-[18.5rem]">
        <div className="rounded-main border border-primary-100 px-6 pb-8 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-xl font-semibold capitalize">
              Filters
            </h2>
            <Sliders size={20} className="text-primary-400" />
          </div>
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Clothing</h3>
          <ClothingCheckbox />

          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Price</h3>
          <DoubleRangeSlider />
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Size</h3>
          <SizesCheckbox />
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Dress Style</h3>
          <DressStyleCheckbox />
        </div>
      </div>
    </div>
  );
};

const VerticalDivider = () => (
  <div className="my-6 h-px w-full bg-primary-100"></div>
);
