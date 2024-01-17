import { Button } from '@/components/UI/Button';
import { CheckIcon, HomeIcon } from '@heroicons/react/20/solid';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

const AddressList = () => {
  return (
    <div className="space-y-4 text-sm">
      {[...Array(3).keys()].map((_, i) => {
        return (
          <div key={i} className="rounded-xl p-5 ring-1 ring-primary-50">
            <div className="relative mb-4 flex flex-col gap-2 text-base font-medium text-primary-500">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary-50">
                <HomeIcon className="h-4 w-4 text-primary-300" />
              </span>
              <p>Home Address 1</p>
              <Button
                variant={'secondary'}
                size={'xs'}
                className="absolute right-0 top-0 gap-1.5"
              >
                <PencilSquareIcon className="size-4" />
                Edit
              </Button>
            </div>
            <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Address
                </dd>
                <dt>2770 McDonald Avenue</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  City
                </dd>
                <dt>Paullina</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Country
                </dd>
                <dt>United States</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Phone
                </dd>
                <dt>+1407-936-6097</dt>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
};
export default AddressList;
