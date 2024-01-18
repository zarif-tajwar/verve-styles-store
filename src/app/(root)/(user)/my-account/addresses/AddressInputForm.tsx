'use client';

import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  HashtagIcon,
  HomeIcon,
  BriefcaseIcon,
} from '@heroicons/react/16/solid';
import { Label } from '@/components/UI/Label';

const AddressInputForm = () => {
  return (
    <form>
      <div className="grid grid-cols-2 gap-8">
        <div className="grid gap-1">
          <Label required={true} htmlFor="address" className="w-max">
            Your Address
          </Label>
          <Input
            type="text"
            id="address"
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="country" className="w-max">
            Country
          </Label>
          <Input
            type="text"
            id="country"
            placeholder="Enter your country"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="city" className="w-max">
            City
          </Label>
          <Input type="text" id="city" placeholder="Enter your city" required />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="phone" className="w-max">
            Phone
          </Label>
          <Input
            type="text"
            id="phone"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label required={false} htmlFor="address-label" className="w-max">
            Address Label
          </Label>
          <Input
            type="text"
            id="address-label"
            placeholder="Name this address"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="address-type" required={false}>
            Choose Address Type
          </Label>
          <RadioGroup.Root id="address-type" defaultValue="not-relevant">
            <div className="flex items-start gap-2 text-sm">
              <label
                htmlFor="not-relevant"
                className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
              >
                <RadioGroup.Item value="not-relevant" id="not-relevant" />
                <span className="inline-flex items-center gap-1">
                  <HashtagIcon className="-ml-0.5 size-4" />
                  Not relevant
                </span>
              </label>
              <label
                htmlFor="home"
                className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
              >
                <RadioGroup.Item value="home" id="home" />
                <span className="inline-flex items-center gap-1">
                  <HomeIcon className="-ml-0.5 size-4" />
                  Home
                </span>
              </label>
              <label
                htmlFor="office"
                className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
              >
                <RadioGroup.Item value="office" id="office" />
                <span className="inline-flex items-center gap-1">
                  <BriefcaseIcon className="-ml-0.5 size-4" />
                  Office
                </span>
              </label>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
    </form>
  );
};
export default AddressInputForm;
