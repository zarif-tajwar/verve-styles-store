'use client';

import * as AccountDetailsCard from '@/components/UI/AccountDetailsCard';
import { useAddressesQuery } from '@/lib/hooks/useAddressQuery';
import {
  BriefcaseIcon,
  HashtagIcon,
  HomeIcon,
} from '@heroicons/react/16/solid';
import { useSession } from 'next-auth/react';
import AddressDelete from './AddressDelete';
import EditAddress from './EditAddress';

const AddressList = () => {
  const session = useSession();
  const { data, isFetching } = useAddressesQuery(session.data ?? undefined);
  const addresses = data?.data;

  if (isFetching) {
    return (
      <div className="text-sm">
        {[...Array(3).keys()].map((i) => {
          return (
            <AccountDetailsCard.Skeleton
              key={i}
              headingClass="mb-3"
              gridClass="gap-y-2"
              iconClass={'size-7'}
            />
          );
        })}
      </div>
    );
  }

  if (addresses && addresses.length === 0) {
    return <p>{`You dont have any saved addresses!`}</p>;
  }

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
          <AccountDetailsCard.Card key={address.id}>
            <AccountDetailsCard.CardHeader>
              <AccountDetailsCard.CardHeaderIcon>
                {address.type === 'home' && <HomeIcon className="size-4" />}
                {address.type === 'office' && (
                  <BriefcaseIcon className="size-4" />
                )}
                {address.type === 'not-relevant' && (
                  <HashtagIcon className="size-4" />
                )}
              </AccountDetailsCard.CardHeaderIcon>
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
            </AccountDetailsCard.CardHeader>
            <AccountDetailsCard.CardList>
              {listItemsData.map((item) => {
                return (
                  <AccountDetailsCard.CardListItem key={item.heading}>
                    <AccountDetailsCard.CardListItemHeading>
                      {item.heading}
                    </AccountDetailsCard.CardListItemHeading>
                    <AccountDetailsCard.CardListItemDescription>
                      {item.description}
                    </AccountDetailsCard.CardListItemDescription>
                  </AccountDetailsCard.CardListItem>
                );
              })}
            </AccountDetailsCard.CardList>
          </AccountDetailsCard.Card>
        );
      })}
    </div>
  );
};
export default AddressList;
