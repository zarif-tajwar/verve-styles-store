'use client';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { Slider2Icon, SliderIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import Divider from '../UI/Divider';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '../UI/Drawer';
import ClothingCheckbox from './ClothingCheckbox';
import DressStyleCheckbox from './DressStyleCheckbox';
import PriceRangeSlider from './PriceRangeSlider';
import SizesCheckbox from './SizesCheckbox';
import SortByRadioGroup from './SortByRadioGroup';

const ShopFiltersDrawer = () => {
  return (
    <div className="block lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size={'md'} roundness={'lg'} className="w-full gap-2">
            <SliderIcon className="size-5" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[calc(95dvh-var(--close-size)-16px)] w-screen rounded-t-main [--close-size:2.5rem] sm:[--close-size:3rem]">
          <Container className="">
            <div className="relative">
              <DrawerClose className="absolute -top-2 right-0 inline-flex size-[var(--close-size)] -translate-y-full items-center justify-center rounded-full bg-primary-0 text-primary-500 transition-colors duration-200 hover:bg-primary-50">
                <XMarkIcon className="size-6" />
              </DrawerClose>
            </div>
          </Container>
          <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] [--divider-margin:1.25rem] [--heading-margin:1rem]">
            <Container>
              <div className="flex justify-center pt-2.5 sm:pt-4 md:pt-5">
                <span className="mx-auto inline-block h-2.5 w-24 rounded-full bg-primary-100 sm:h-3 sm:w-28 md:w-36"></span>
              </div>
              <div className="flex items-center justify-between px-2 py-3">
                <DrawerTitle className="font-geist text-2xl font-semibold capitalize">
                  Filters
                </DrawerTitle>
                <Slider2Icon className="text-primary-300" />
              </div>
            </Container>
            <Divider className="" />
            <Container data-vaul-no-drag className="overflow-auto py-8">
              <div className="">
                <div className="px-2">
                  <h3 className="mb-[var(--heading-margin)] text-lg font-semibold capitalize">
                    Sort By
                  </h3>
                  <SortByRadioGroup />
                  <Divider className="my-[var(--divider-margin)] bg-primary-50" />
                  <h3 className="mb-[var(--heading-margin)] text-lg font-semibold capitalize">
                    Clothing
                  </h3>
                  <ClothingCheckbox />

                  <Divider className="my-[var(--divider-margin)] bg-primary-50" />
                  <h3 className="mb-[var(--heading-margin)] text-lg font-semibold capitalize">
                    Price
                  </h3>
                  <PriceRangeSlider />
                  <Divider className="my-[var(--divider-margin)] bg-primary-50" />
                  <h3 className="mb-[var(--heading-margin)] text-lg font-semibold capitalize">
                    Size
                  </h3>
                  <SizesCheckbox />
                  <Divider className="my-[var(--divider-margin)] bg-primary-50" />
                  <h3 className="mb-[var(--heading-margin)] text-lg font-semibold capitalize">
                    Dress Style
                  </h3>
                  <DressStyleCheckbox />
                </div>
              </div>
            </Container>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default ShopFiltersDrawer;
