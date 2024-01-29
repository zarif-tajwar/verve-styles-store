import Divider from '../UI/Divider';
import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';
import { Sliders } from 'lucide-react';

export const FilterSidebar = () => {
  return (
    <div className="sticky top-20 h-max">
      <div className="w-max max-w-[18.5rem]">
        <div className="rounded-main border border-primary-50 px-6 pb-8 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-xl font-semibold capitalize">
              Filters
            </h2>
            <Sliders size={20} className="text-primary-400" />
          </div>
          <Divider className="my-6" />
          <h3 className="mb-4 font-semibold capitalize">Clothing</h3>
          <ClothingCheckbox />

          <Divider className="my-6" />
          <h3 className="mb-4 font-semibold capitalize">Price</h3>
          <DoubleRangeSlider />
          <Divider className="my-6" />
          <h3 className="mb-4 font-semibold capitalize">Size</h3>
          <SizesCheckbox />
          <Divider className="my-6" />
          <h3 className="mb-4 font-semibold capitalize">Dress Style</h3>
          <DressStyleCheckbox />
        </div>
      </div>
    </div>
  );
};
