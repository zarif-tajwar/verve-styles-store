import { Button } from '@/components/UI/Button';
import {
  CheckIcon,
  HomeIcon,
  BriefcaseIcon,
  HashtagIcon,
} from '@heroicons/react/16/solid';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import EditAddress from './EditAddress';
import { Session } from 'next-auth/types';
import { getSavedAddressesServer } from '@/lib/server/user';

const AddressList = async ({ session }: { session: Session }) => {
  const savedAddreses = await getSavedAddressesServer(session);

  return (
    <div className="space-y-4 text-sm">
      {savedAddreses?.map((address, i) => {
        return (
          <div key={i} className="rounded-xl p-5 ring-1 ring-primary-50">
            <div className="relative mb-4 flex flex-col gap-2 text-base font-medium text-primary-500">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary-50 text-primary-300">
                {address.type === 'home' && <HomeIcon className="size-4" />}
                {address.type === 'office' && (
                  <BriefcaseIcon className="size-4" />
                )}
                {address.type === 'not-relevant' && (
                  <HashtagIcon className="size-4" />
                )}
              </span>
              <p>{address.label}</p>
              <EditAddress />
            </div>
            <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Address
                </dd>
                <dt>{address.address}</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  City
                </dd>
                <dt>{address.city}</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Country
                </dd>
                <dt>{address.country}</dt>
              </div>
              <div className="space-y-2">
                <dd className="font-medium text-primary-400 opacity-90">
                  Phone
                </dd>
                <dt>{address.phone}</dt>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
};
export default AddressList;
