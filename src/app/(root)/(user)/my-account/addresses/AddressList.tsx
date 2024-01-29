'use client';

import {
  HomeIcon,
  BriefcaseIcon,
  HashtagIcon,
} from '@heroicons/react/16/solid';
import EditAddress from './EditAddress';
import AddressDelete from './AddressDelete';
import { useSession } from 'next-auth/react';
import { useAddressesQuery } from '@/lib/hooks/useAddressQuery';
import * as AccoundDetailsCard from '@/components/UI/AccountDetailsCard';

const AddressList = () => {
  const session = useSession();
  const addressesQuery = useAddressesQuery(session.data ?? undefined);
  const addresses = addressesQuery.data?.data;

  return (
    <div className="space-y-4 text-sm">
      {addresses?.map((address) => {
        const listItemsData = [
          { heading: 'Address', description: address.address },
          { heading: 'City', description: address.city },
          { heading: 'Country', description: address.country },
          { heading: 'Phone', description: address.phone },
        ];
        return (
          <AccoundDetailsCard.Card key={address.id}>
            <AccoundDetailsCard.CardHeader>
              <AccoundDetailsCard.CardHeaderIcon>
                {address.type === 'home' && <HomeIcon className="size-4" />}
                {address.type === 'office' && (
                  <BriefcaseIcon className="size-4" />
                )}
                {address.type === 'not-relevant' && (
                  <HashtagIcon className="size-4" />
                )}
              </AccoundDetailsCard.CardHeaderIcon>
              <div className="flex items-center gap-2">
                <p>{address.label}</p>
                {address.isDefault && (
                  <span className="text-xs font-medium uppercase text-primary-300">
                    (Default)
                  </span>
                )}
              </div>
              <div className="absolute right-0 top-0 flex gap-2">
                <EditAddress addressData={address} />
                <AddressDelete addressId={address.id} />
              </div>
            </AccoundDetailsCard.CardHeader>
            <AccoundDetailsCard.CardList>
              {listItemsData.map((item) => {
                return (
                  <AccoundDetailsCard.CardListItem key={item.heading}>
                    <AccoundDetailsCard.CardListItemHeading>
                      {item.heading}
                    </AccoundDetailsCard.CardListItemHeading>
                    <AccoundDetailsCard.CardListItemDescription>
                      {item.description}
                    </AccoundDetailsCard.CardListItemDescription>
                  </AccoundDetailsCard.CardListItem>
                );
              })}
            </AccoundDetailsCard.CardList>
          </AccoundDetailsCard.Card>
        );
      })}
    </div>
  );
};
export default AddressList;
