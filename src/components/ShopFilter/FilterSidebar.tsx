import { Slider2Icon } from '../Svgs/icons';
import Divider from '../UI/Divider';
import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';

export const FilterSidebar = () => {
  return (
    <div className="sticky top-2 hidden h-max [--divider-margin:0.75rem] [--heading-margin:0.625rem] lg:block [@media(height>=51rem)]:top-5 [@media(height>=51rem)]:[--divider-margin:1.5rem] [@media(height>=51rem)]:[--heading-margin:1rem]">
      <div className="max-w-[18.5rem]">
        <div className="rounded-main border border-primary-50 p-5 [@media(height>=51rem)]:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-xl font-semibold capitalize">
              Filters
            </h2>
            <Slider2Icon className="text-primary-300" />
          </div>
          <Divider className="my-[var(--divider-margin)]" />
          <h3 className="mb-[var(--heading-margin)] font-semibold capitalize">
            Clothing
          </h3>
          <ClothingCheckbox />

          <Divider className="my-[var(--divider-margin)]" />
          <h3 className="mb-[var(--heading-margin)] font-semibold capitalize">
            Price
          </h3>
          <DoubleRangeSlider />
          <Divider className="my-[var(--divider-margin)]" />
          <h3 className="mb-[var(--heading-margin)] font-semibold capitalize">
            Size
          </h3>
          <SizesCheckbox />
          <Divider className="my-[var(--divider-margin)]" />
          <h3 className="mb-[var(--heading-margin)] font-semibold capitalize">
            Dress Style
          </h3>
          <DressStyleCheckbox />
        </div>
      </div>
    </div>
  );
};
